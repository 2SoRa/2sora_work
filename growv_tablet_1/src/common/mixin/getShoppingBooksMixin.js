import readingClubFactory from "@/api/reading-club/readingClub-factory";
const bookListApi = readingClubFactory.get('vscanSearch')

const getShoppingBooksMixin = {
    methods: {
        async getAllBook(params, search) {
            await Promise.all([
                bookListApi.getProductSet(params),
                bookListApi.getProductList(params)
            ]).then((res) => {
                this.bookTotalCount = res[0].data.data.totalCount + res[1].data.data.totalCount;
                this.scrollData.isLoading = false;
                let first = [];
                first.push(...res[0].data.data.data, ...res[1].data.data.data)
                let total = first.length + this.secBook.length
                //20개 이하일 시
                if (this.bookTotalCount <= this.scrollData.pageSize) {
                    Array.prototype.push.apply(this.bookData, first);
                }
                //20개 이상이고 처음 로딩시 || 세트,단행본 중 값이 하나만 있을 경우
                else if (this.bookTotalCount > this.scrollData.pageSize && this.secBook.length == 0) {
                    let sliceData = first.slice(0, this.scrollData.pageSize)
                    this.secBook = first.slice(this.scrollData.pageSize, first.length)
                    Array.prototype.push.apply(this.bookData, sliceData);
                }
                //다음 로딩
                else if(this.secBook.length !== 0 && this.bookTotalCount !== this.bookData.length){
                    let temp = [];
                    temp.push(...this.secBook, ...first)
                    let sliceData = temp.slice(0, this.scrollData.pageSize)
                    this.secBook = temp.slice(this.scrollData.pageSize, total)
                    Array.prototype.push.apply(this.bookData, sliceData);
                }
                //마지막 로딩이면 남아있던 데이터 모두 삽입
                else if ( this.bookTotalCount === this.bookData.length) {
                    Array.prototype.push.apply(this.bookData, this.secBook);
                }
                this.setBadges();
                // 도서 검색일 경우
                if (search) {
                    if (this.scrollData.pageIndex !== 0) {
                        const element = document.querySelector('.content-scroll-area')
                        let t = element.scrollTop;
                        setTimeout(function () {
                            element.scrollTo({top: t + 150, behavior: 'smooth'})
                        }, 10);
                    }
                    this.isResult();
                }
            }).catch((err) => console.log(err))
        },
        setBadges() {
            const order = ['dogjeom', 'vscan']
            this.bookData.map((el) => {
                return el.badges.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
            })
        }
    }
}

export default getShoppingBooksMixin;