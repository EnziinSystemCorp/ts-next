import {Map} from 'immutable'
import { Circle, UserTie } from '~/core/domain/circles'

/**
 * Circle service interface
 *
 * @export
 * @interface ICircleService
 */
export default interface ICircleService {

  addCircle: (userId: string, circle: Circle) => Promise<string>
  updateCircle: (userId: string, circleId: string, circle: Circle) => Promise<void>
  deleteCircle: (userId: string, circleId: string) => Promise<void>
  getCircles: (userId: string) => Promise<Map<string, Map<string, any>>>
}
