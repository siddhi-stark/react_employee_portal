import {Subject} from 'rxjs';

class SharedService {
  static clockIn = new Subject();
  
  static clockOut = new Subject();
}

export default SharedService;