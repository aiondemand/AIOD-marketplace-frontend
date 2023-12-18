import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DeploymentsService } from '../../services/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import {
    Deployment,
    statusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

interface deploymentTableRow {
    uuid: string;
    name: string;
    status: string;
    containerName: string;
    gpus: string | number;
    creationTime: string;
    endpoints?: object | undefined;
    mainEndpoint: string;
    error_msg?: string;
}

@Component({
    selector: 'app-deployments-list',
    templateUrl: './deployments-list.component.html',
    styleUrls: ['./deployments-list.component.scss'],
})
export class DeploymentsListComponent implements OnInit, OnDestroy {
    constructor(
        public dialog: MatDialog,
        private deploymentsService: DeploymentsService,
        public confirmationDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _liveAnnouncer: LiveAnnouncer
    ) {}

    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }
    isLoading = false;

    columns: Array<TableColumn> = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
        { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'endpoints', header: '', hidden: true },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];
    dataset: Array<deploymentTableRow> = [];

    dataSource!: MatTableDataSource<deploymentTableRow>;
    selection = new SelectionModel<deploymentTableRow>(true, []);
    displayedColumns: string[] = [];
    private unsub = new Subject<void>();

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    removeDeployment(e: MouseEvent, row: deploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `¿Are you sure you want to delete this deployment?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    const uuid = row.uuid;
                    this.deploymentsService
                        .deleteDeploymentByUUID(uuid)
                        .subscribe({
                            next: (response: statusReturn) => {
                                if (
                                    response &&
                                    response['status'] == 'success'
                                ) {
                                    const itemIndex = this.dataset.findIndex(
                                        (obj) => obj['uuid'] === uuid
                                    );
                                    this.dataset.splice(itemIndex, 1);
                                    this.dataSource =
                                        new MatTableDataSource<deploymentTableRow>(
                                            this.dataset
                                        );
                                    this._snackBar.open(
                                        'Successfully deleted deployment with uuid: ' +
                                            uuid,
                                        'X',
                                        {
                                            duration: 3000,
                                            panelClass: ['primary-snackbar'],
                                        }
                                    );
                                } else {
                                    this._snackBar.open(
                                        'Error deleting deployment with uuid: ' +
                                            uuid,
                                        'X',
                                        {
                                            duration: 3000,
                                            panelClass: ['red-snackbar'],
                                        }
                                    );
                                }
                            },
                            error: () => {
                                this._snackBar.open(
                                    'Error deleting deployment with uuid: ' +
                                        uuid,
                                    'X',
                                    {
                                        duration: 3000,
                                        panelClass: ['red-snackbar'],
                                    }
                                );
                            },
                        });
                }
            });
    }

    getDeploymentsList() {
        this.isLoading = true;
        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.deploymentsService.getDeployments())
            )
            .subscribe((deploymentsList: Deployment[]) => {
                this.dataset = [];
                this.isLoading = false;
                deploymentsList.forEach((deployment: Deployment) => {
                    const row: deploymentTableRow = {
                        uuid: deployment.job_ID,
                        name: deployment.title,
                        status: deployment.status,
                        containerName: deployment.docker_image,
                        gpus: '-',
                        creationTime: deployment.submit_time,
                        endpoints: deployment.endpoints,
                        mainEndpoint: deployment.main_endpoint,
                    };
                    if (deployment.error_msg) {
                        row.error_msg = deployment.error_msg;
                    }
                    if (
                        deployment.resources &&
                        Object.keys(deployment.resources).length !== 0
                    ) {
                        row.gpus = deployment.resources.gpu_num;
                    }
                    this.dataset.push(row);
                });
                this.dataSource = new MatTableDataSource<deploymentTableRow>(
                    this.dataset
                );
            });
    }

    isDeploymentRunning(row: deploymentTableRow) {
        return row.status === 'running';
    }

    getDeploymentEndpoints(row: deploymentTableRow) {
        return row.endpoints;
    }

    hasDeploymentErrors(row: deploymentTableRow) {
        return row.error_msg;
    }

    returnDeploymentBadge(status: string) {
        return getDeploymentBadge(status);
    }

    openDeploymentDetailDialog(row: deploymentTableRow): void {
        const dialogRef = this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: row.uuid },
            width: '650px',
            maxWidth: '650px',
            minWidth: '650px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
        });
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    ngOnInit(): void {
        this.dataset = [];
        this.getDeploymentsList();
        // set checkbox column
        //this.displayedColumns.push("select");

        // set table columns
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        ); // pre-fix static
        // add action column
        this.dataSource = new MatTableDataSource<deploymentTableRow>(
            this.dataset
        );

        // set pagination
        //this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
