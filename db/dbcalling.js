const sql = require("mssql");
const conn = require('./dbconfig')


const getLedger = async () => {
    let id = "C00002";

    try {
        await sql.connect(conn.config);
        const request = new sql.Request();
        request.input("c_id", sql.VarChar, id);
        const result = await request.execute("GetLedgerBalance");
        const ledgerBalance = result.recordset[0].ledger_balance;
        return "Your account balance is: *₹ " + ledgerBalance + "*";
    } catch (err) {
        console.log(`Error executing sp: ${err}`);
        return 'Sorry for the inconvenience, please try again later';
    }
}



const proc_GetDetailData_whatsAPP = async (text, client_code) => {
    try {
        await sql.connect(conn.config);
        const result = await sql.query`EXEC PROC_GetDetailData_whatsAPP @text = ${text}, @client_code = ${client_code}`;
        return result.recordset
    } catch (err) {
        console.error(err);
    } finally {
        sql.close();
    }
}


module.exports = {
    getLedger,
    proc_GetDetailData_whatsAPP
}