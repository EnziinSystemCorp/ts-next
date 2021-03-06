import StringAPI from '~/api/StringAPI';
import { ServerRequestType } from '~/constants/serverRequestType';
import { ServerRequestModel } from '~/models/server';
import { ServerRequestStatusType } from '~/store/actions/serverRequestStatusType';
import Cookies from 'js-cookie'

/**
 * Create login server request
 */
const createLoginRequest = (email: string) => {
  const requestId = StringAPI.createServerRequestId(ServerRequestType.AuthLogin, email)
  return new ServerRequestModel(
      ServerRequestType.AuthLogin,
      requestId,
      '',
      ServerRequestStatusType.Sent
  )
}

/**
 * Create signup server request
 */
const createSignupRequest = (email: string) => {
  const requestId = StringAPI.createServerRequestId(ServerRequestType.AuthSignup, email)
  return new ServerRequestModel(
      ServerRequestType.AuthSignup,
      requestId,
      '',
      ServerRequestStatusType.Sent
  )
}

/**
 * Store token id
 */
const storeTokenId = (tokenId: string) => {
  window.localStorage.setItem('red-gold.scure.token', tokenId)
}

/**
 * Get token id
 */
const getTokenId = () => {
  window.localStorage.getItem('red-gold.scure.token')
}

const createCookie = (name: string,value: string,days: number) => {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toUTCString();
	}
  else var expires = "";
  Cookies.set(name, value, { expires: Date.parse(expires), path: '/' })
}

const readCookie = (name: string, cookie?: any) => {
	let nameEQ = name + "=";
  let ca = ['']
  if (cookie) {
    ca = cookie.split(';');
  } else {
    ca = document.cookie.split(';');
  }
	for(let i=0;i < ca.length;i++) {
		let c = ca[i];
		while (c.charAt(0)===' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

const eraseCookie = (name: string, req?: any) => {
  let domain =''
  if (req) {
    domain = req.get('origin')
  } else {
    domain = `.${document.domain.split('.').splice(1).join('.')}`
  }
  Cookies.remove(name, { path: '/', domain})
  // document.cookie = name +`=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;Domain=.${document.domain.split('.').splice(1).join('.')}`;
}

export const AuthAPI = {
  createLoginRequest,
  createSignupRequest,
  storeTokenId,
  getTokenId,
  createCookie,
  readCookie,
  eraseCookie
}
