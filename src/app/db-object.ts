import { BehaviorSubject } from 'rxjs';

export class DbObject<T> extends BehaviorSubject<T> {
    private dbPath : string[];
    private dbService: any;

    constructor(state, path, dbService) {
        super(state);

        this.dbPath = path;
        this.dbService = dbService;

        if(state.socketLoading){
            this.dbService.ListenForSocketLoaded().subscribe((loaded) => {
                if(loaded) {
                    let newValue = this.NewValue;
                    this.QuietUpdate(newValue);
                }
            });
        }
    }

   //Update all other clients 
    Update(value: any) {
        this.QuietUpdate(value);
        this.dbService.SocketUpdate(value, this.dbPath);
    }
    
    // Receive updates from other clients 
    QuietUpdate(value) { 
        this.next(value); 
    }
    
    private get NewValue(): any {
    return this.dbService.DbValue(this.dbPath.slice());
    } 
}
