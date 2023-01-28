export interface DashboardItem {
    bankSide: string;
    count: number;
    refStatus: RefStatusModel;
}

export class RefStatusModel {
    code: string;
    name: string;
    finalStatus: boolean;
}

export class DashBoardList {
    dashboardDataList: DashboardItem[];
}
