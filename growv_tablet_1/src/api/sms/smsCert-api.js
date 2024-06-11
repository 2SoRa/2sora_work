import studyAxios from "@/common/study-axios";

// ID찾기 회원정보 조회
function smsCertSend(data){
    return studyAxios.post("/clientsvc/account/v1/web/sms/cert/send/pw", data);
}

// ID찾기 회원정보 조회
function smsCertCheck(data){
    return studyAxios.post("/clientsvc/account/v1/web/sms/cert/check", data);
}

function smsPhoneCertSend(data){
    return studyAxios.post("/clientsvc/account/v1/web/sms/cert/send", data);
}

export {smsCertSend, smsCertCheck, smsPhoneCertSend};