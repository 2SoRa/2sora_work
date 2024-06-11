let url = window.location.href;
let prod = url.indexOf("://stw.superv.com") > -1;
let dev = url.indexOf("://dev-stw.superv.com") > -1;

let constant = {
    studyUrl: prod ? "https://study.superv.com" : dev ? "https://dev-study.superv.com" : "http://localhost:8080",
    isStudyProdUrl: prod ? true : false
};

export default constant