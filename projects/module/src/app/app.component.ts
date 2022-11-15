import {Component} from '@angular/core';
import {AlgorithmResult, DropFile, FD_LOG, PetriNetSerialisationService, Trace, XesLogParserService} from 'ilpn-components';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public fdLog = FD_LOG;

    public log: Array<Trace> | undefined;
    public resultFiles: Array<DropFile> = [];
    public processing = false;

    constructor(private _logParser: XesLogParserService,
                private _netSerializer: PetriNetSerialisationService) {
    }

    public processLogUpload(files: Array<DropFile>) {
        this.processing = true;
        this.resultFiles = [];

        const algorithmProtocol = new AlgorithmResult("ILP miner");

        this.log = this._logParser.parse(files[0].content);
        console.debug(this.log);


    }

}
