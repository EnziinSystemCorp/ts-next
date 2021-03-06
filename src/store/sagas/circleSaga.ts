import { CircleActionType } from '~/constants/circleActionType';
import { SocialProviderTypes } from '~/core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { provider } from '~/socialEngine';
import * as circleActions from '~/store/actions/circleActions';
import * as globalActions from '~/store/actions/globalActions';
import * as userActions from '~/store/actions/userActions';
import { authorizeSelector } from '~/store/reducers/authorize';
import ICircleService from '~/core/services/circles/ICircleService';
import { IUserTieService } from '~/core/services/circles/IUserTieService';

/**
 * Get service providers
 */
const circleService: ICircleService = provider.get<ICircleService>(SocialProviderTypes.CircleService)
const userTieService: IUserTieService = provider.get<IUserTieService>(SocialProviderTypes.UserTieService)

/***************************** Subroutines ************************************/

/**
 * Fetch circles
 */
function* dbFetchCircle() {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      console.log('dbFetchCircle ', uid)
      const circles: Map<string, Map<string, any>> = yield call(circleService.getCircles, uid)
      yield put(circleActions.addCircles(circles))
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Fetch user ties
 */
function* dbFetchUserTies() {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      const result = yield call(userTieService.getUserTies, uid)
      yield put(userActions.addPeopleInfo(result))
      yield put(circleActions.addUserTies(result))
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Fetch user tieds
 */
function* dbFetchUserTieds() {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      const result = yield call(userTieService.getUserTieSender, uid)
      yield put(userActions.addPeopleInfo(result))
      yield put(circleActions.addUserTieds(result))
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}


export function* initCircleSaga() {
  yield all([
    call(dbFetchCircle),
    call(dbFetchUserTies),
    call(dbFetchUserTieds),
  ]) 
}

export default function* circleSaga() {
  yield all([
    takeLatest(CircleActionType.DB_FETCH_CIRCLES, dbFetchCircle),
    takeLatest(CircleActionType.DB_FETCH_USER_TIES, dbFetchUserTies),
    takeLatest(CircleActionType.DB_FETCH_USER_TIEDS, dbFetchUserTieds),
  ])
}
