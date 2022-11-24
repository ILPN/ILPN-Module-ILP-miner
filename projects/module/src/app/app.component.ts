import {Component, OnDestroy} from '@angular/core';
import {
    AlgorithmResult, DropFile, FD_LOG,
    IlpMinerService, NetAndReport, PetriNetSerialisationService, Trace, XesLogParserService
} from 'ilpn-components';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    public fdLog = FD_LOG;

    public log: Array<Trace> | undefined;
    public resultFiles: Array<DropFile> = [];
    public processing = false;

    private _sub: Subscription | undefined;

    constructor(private _logParser: XesLogParserService,
                private _netSerializer: PetriNetSerialisationService,
                private _miner: IlpMinerService) {
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    public processLogUpload(files: Array<DropFile>) {
        this.processing = true;
        this.resultFiles = [];

        this.log = this._logParser.parse(files[0].content);
        console.debug(this.log);

        const runs = `number of runs: ${this.log.length}`;

        const start = performance.now();
        this._sub = this._miner.mine(this.log).subscribe((r: NetAndReport) => {
            const stop = performance.now();
            const report = new AlgorithmResult('ILP miner', start, stop);
            report.addOutputLine(runs);
            r.report.forEach(l => report.addOutputLine(l));
            this.resultFiles = [new DropFile('model.pn', this._netSerializer.serialise(r.net)), report.toDropFile('report.txt')];
            this.processing = false;
        });
    }

}
