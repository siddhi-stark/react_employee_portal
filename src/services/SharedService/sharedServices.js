import {Subject} from 'rxjs';

class SharedService {
  static clockIn = new Subject();
}

export default SharedService;