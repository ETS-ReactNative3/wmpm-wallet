import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { path } from 'ramda'
import { check, msie } from 'bowser'

import { required, validWalletId } from 'services/FormHelper'

import {
  Banner,
  Button,
  Link,
  Separator,
  Text,
  TextGroup,
  HeartbeatLoader
} from 'blockchain-info-components'
import {
  Form,
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'
import MobileLogin from 'modals/Mobile/MobileLogin'

const isSupportedBrowser =
  check({ safari: '8', chrome: '45', firefox: '45', opera: '20' }) && !msie

export const removeWhitespace = string => string.replace(/\s/g, ``)

const LoginWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const LoginForm = styled(Form)`
  margin: 20px 0;
`
const LoginButton = styled(Button)`
  margin-top: 15px;
`
const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin-top: 3px;
`
const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`
const ResendSmsLink = styled(Link)`
  margin-top: 4px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`

const Login = props => {
  const {
    busy,
    guid,
    formMeta,
    loginError,
    password,
    submitting,
    invalid,
    isGuidValid,
    isGuidEmailAddress,
    ...rest
  } = props
  const { handleSubmit, handleMobile, handleSmsResend, authType } = rest

  const guidError =
    loginError && loginError.toLowerCase().includes('unknown wallet id')
  const passwordError =
    loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const twoFactorError =
    loginError && loginError.toLowerCase().includes('authentication code')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  const isGuidTouched = path(['guid', 'touched'], formMeta)
  const showGuidInvalidError = guid && !isGuidValid && isGuidTouched

  return (
    <LoginWrapper>
      <MobileLogin />
      <Header>
        <Text size='24px' weight={300} capitalize>
          <FormattedMessage
            id='scenes.login.welcome'
            defaultMessage='Welcome back!'
          />
        </Text>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.login.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/signup'>
            <Link size='13px' weight={300} data-e2e='signupLink'>
              <FormattedMessage
                id='scenes.login.register'
                defaultMessage='Sign Up'
              />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Header>
      <Text size='14px' weight={300}>
        <FormattedMessage
          id='scenes.login.explain'
          defaultMessage='Sign in to your wallet below'
        />
      </Text>
      <Separator />
      <LoginForm onSubmit={handleSubmit}>
        {!isSupportedBrowser && (
          <BrowserWarning>
            <Banner type='warning'>
              <FormattedMessage
                id='scenes.login.browserwarning'
                defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
              />
            </Banner>
          </BrowserWarning>
        )}
        <FormGroup>
          <FormItem>
            <FormLabel for='guid'>
              <FormattedMessage
                id='scenes.login.guid'
                defaultMessage='Wallet ID'
              />
            </FormLabel>
            <Field
              name='guid'
              normalize={removeWhitespace}
              validate={[required, validWalletId]}
              component={TextBox}
              borderColor={guidError ? 'invalid' : undefined}
              disabled={!isSupportedBrowser}
              data-e2e='loginGuid'
            />
          </FormItem>
          {guidError && (
            <GuidError inline>
              <Text
                size='12px'
                color='error'
                weight={300}
                data-e2e='walletIdError'
              >
                <FormattedMessage
                  id='scenes.login.guiderror'
                  defaultMessage='Unknown Wallet ID. If you need a reminder '
                />
              </Text>
              <LinkContainer to='/reminder'>
                <Link size='12px' weight={300}>
                  <FormattedMessage
                    id='scenes.login.clickhere'
                    defaultMessage='click here.'
                  />
                </Link>
              </LinkContainer>
            </GuidError>
          )}
          {showGuidInvalidError ? (
            <Text size='14px' weight={300}>
              {isGuidEmailAddress ? (
                <FormattedMessage
                  id='scenes.login.isguidemailerror'
                  defaultMessage='👋Hey! Make sure this is your Wallet ID and not an email address. If you need a reminder'
                />
              ) : (
                <FormattedMessage
                  id='scenes.login.isguidinvalid'
                  defaultMessage="👋Hey! This format doesn't look quite right. Wallet ID's look like this: ef7549a5-94ad-39...If you need a reminder"
                />
              )}{' '}
              <LinkContainer to='/reminder'>
                <Link size='14px' weight={300}>
                  <FormattedMessage
                    id='scenes.login.clickhere'
                    defaultMessage='click here.'
                  />
                </Link>
              </LinkContainer>
            </Text>
          ) : (
            <LoginTextGroup inline>
              <Text size='12px' color='gray-3' weight={300}>
                <FormattedMessage
                  id='scenes.login.info'
                  defaultMessage='Find the login link in your email,'
                />
              </Text>
              <Text size='12px' color='gray-3' weight={300}>
                <FormattedMessage
                  id='scenes.login.info2'
                  defaultMessage=' from our affiliate blockchain.info. i.e. wallet/1111-222-333...'
                />
              </Text>
              <Text size='12px' color='gray-3' weight={300}>
                <FormattedMessage
                  id='scenes.login.info3'
                  defaultMessage='The series of numbers and dashes at the end of the link is your Wallet ID.'
                />
              </Text>
            </LoginTextGroup>
          )}
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='password'>
              <FormattedMessage
                id='scenes.login.password'
                defaultMessage='Password'
              />
            </FormLabel>
            <Field
              name='password'
              validate={[required]}
              component={PasswordBox}
              borderColor={passwordError ? 'invalid' : undefined}
              disabled={!isSupportedBrowser}
              data-e2e='loginPassword'
            />
            {passwordError && (
              <FormError
                position={authType > 0 ? 'relative' : 'absolute'}
                data-e2e='passwordError'
              >
                <FormattedMessage
                  id='scenes.login.wrong_password'
                  defaultMessage='Error decrypting wallet. Wrong password'
                />
              </FormError>
            )}
            {accountLocked && (
              <FormError
                position={
                  authType > 0 || passwordError ? 'relative' : 'absolute'
                }
              >
                {loginError}
              </FormError>
            )}
          </FormItem>
        </FormGroup>
        {authType > 0 && (
          <FormGroup>
            <FormItem>
              <FormLabel for='code'>
                {authType === 1 && (
                  <FormattedMessage
                    id='scenes.login.yubikey'
                    defaultMessage='Yubikey'
                  />
                )}
                {authType === 4 && (
                  <FormattedMessage
                    id='scenes.login.google'
                    defaultMessage='Authenticator App Code'
                  />
                )}
                {authType === 5 && (
                  <FormattedMessage
                    id='scenes.login.mobile'
                    defaultMessage='SMS Code'
                  />
                )}
              </FormLabel>
              <Field
                name='code'
                normalize={removeWhitespace}
                validate={[required]}
                component={authType === 1 ? PasswordBox : TextBox}
                noLastPass
                autoFocus
                borderColor={twoFactorError ? 'invalid' : undefined}
                data-e2e='loginTwoFactorCode'
              />
              {authType === 5 && (
                <ResendSmsLink
                  size='12px'
                  weight={300}
                  onClick={handleSmsResend}
                >
                  <FormattedMessage
                    id='scenes.login.resendsms'
                    defaultMessage='Resend SMS'
                  />
                </ResendSmsLink>
              )}
              {twoFactorError && (
                <FormError position={'absolute'}>{loginError}</FormError>
              )}
            </FormItem>
          </FormGroup>
        )}
        <FormGroup>
          <LoginButton
            type='submit'
            nature='primary'
            fullwidth
            disabled={submitting || invalid || busy || !password}
            data-e2e='loginButton'
          >
            {busy && !loginError ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='scenes.login.login'
                defaultMessage='Log In'
              />
            )}
          </LoginButton>
        </FormGroup>
      </LoginForm>
      {isSupportedBrowser && (
        <Footer>
          <Link
            size='13px'
            weight={300}
            onClick={handleMobile}
            data-e2e='loginViaMobileLink'
          >
            <FormattedMessage
              id='scenes.login.loginmobile'
              defaultMessage='Login via Mobile'
            />
          </Link>
          <TextGroup inline>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='scenes.login.troubles'
                defaultMessage='Having some trouble?'
              />
            </Text>
            <LinkContainer to='/help'>
              <Link size='13px' weight={300} data-e2e='loginGetHelp'>
                <FormattedMessage
                  id='scenes.login.options'
                  defaultMessage='Get help logging in'
                />
              </Link>
            </LinkContainer>
          </TextGroup>
        </Footer>
      )}
    </LoginWrapper>
  )
}

Login.propTypes = {
  handleMobile: PropTypes.func.isRequired,
  handleSmsResend: PropTypes.func.isRequired
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(Login)
