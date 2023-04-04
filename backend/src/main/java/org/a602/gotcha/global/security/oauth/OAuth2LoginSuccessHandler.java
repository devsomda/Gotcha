package org.a602.gotcha.global.security.oauth;

import static org.a602.gotcha.global.security.jwt.JwtTokenProvider.*;
import static org.a602.gotcha.global.security.oauth.HttpCookieOAuthAuthorizationRequestRepository.*;
import static org.apache.http.HttpHeaders.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.a602.gotcha.domain.member.entity.Member;
import org.a602.gotcha.domain.member.repository.MemberRepository;
import org.a602.gotcha.global.security.jwt.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	public static final String EMAIL = "email";
	public static final String ACCESS_TOKEN = "accessToken";
	public static final String REFRESH_TOKEN = "refreshToken";
	public static final String NICKNAME = "nickname";
	public static final String PROFILE_IMAGE = "profileImage";
	public static final String REGISTRATION_ID = "registrationId";
	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final HttpCookieOAuthAuthorizationRequestRepository httpCookieOAuthAuthorizationRequestRepository;

	@Override
	public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response,
		final Authentication authentication) throws IOException {
		final String targetUrl = determineTargetUrl(request, response, authentication);

		clearAuthenticationAttributes(request, response);
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
	}

	protected String determineTargetUrl(final HttpServletRequest httpServletRequest,
		final HttpServletResponse httpServletResponse, final Authentication authentication) {
		log.info("로그인 성공 후처리 시작");
		final Optional<String> redirectUri = CookieUtil.getCookie(httpServletRequest, REDIRECT_URI)
			.map(Cookie::getValue);

		final String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
		final OAuth2User oAuth2User = (OAuth2User)authentication.getPrincipal();
		final Map<String, Object> attributes = oAuth2User.getAttributes();

		log.info("로그인 유저정보 = {}", oAuth2User);

		final OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken)authentication;
		final String registrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(); // provider 정보추출
		final OAuth2UserInfo oAuth2UserInfo = createOAuth2UserInfo(registrationId, attributes); // provider에 해당하는 유저객체 생성
		final Optional<Member> optionalMember = memberRepository.findMemberByEmail(oAuth2UserInfo.getEmail()); // 데이터 조회

		if (optionalMember.isPresent()) {
			final Member member = optionalMember.get();
			final String accessToken = BEARER + jwtTokenProvider.createAccessToken(member);
			final String refreshToken = BEARER + jwtTokenProvider.createRefreshToken(accessToken, member.getEmail());

			httpServletResponse.setHeader(AUTHORIZATION, accessToken);

			return UriComponentsBuilder.fromUriString(targetUrl)
				.queryParam(ACCESS_TOKEN, accessToken)
				.queryParam(REFRESH_TOKEN, refreshToken)
				.queryParam(EMAIL, member.getEmail())
				.queryParam(NICKNAME, URLEncoder.encode(member.getNickname(), StandardCharsets.UTF_8))
				.queryParam(PROFILE_IMAGE, member.getProfileImage())
				.build()
				.toUriString();

		} else {
			return UriComponentsBuilder.newInstance()
				.queryParam(EMAIL, oAuth2UserInfo.getEmail())
				.queryParam(REGISTRATION_ID, registrationId)
				.toUriString();
		}
	}

	private OAuth2UserInfo createOAuth2UserInfo(final String registrationId, final Map<String, Object> attributes) {
		if (registrationId.equals(SocialType.GOOGLE.getSocialType())) {
			return new GoogleOAuth2UserInfo(attributes);
		} else {
			return new KakaoOAuth2UserInfo(attributes);
		}
	}

	protected void clearAuthenticationAttributes(final HttpServletRequest httpServletRequest,
		final HttpServletResponse httpServletResponse) {
		super.clearAuthenticationAttributes(httpServletRequest);
		httpCookieOAuthAuthorizationRequestRepository.removeAuthorizationRequestCookies(httpServletRequest,
			httpServletResponse);
	}

}