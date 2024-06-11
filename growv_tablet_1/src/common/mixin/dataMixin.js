import moment from "moment/moment";
import { mapGetters } from "vuex";

const dataMixin = {
	data() {
		return {
			moveDate : '',
			moveYear : '',
			moveMonth : '',
			moveIsPrevYear : true,
			moveIsNextYear : true,
			moveIsPrevMonth : true,
			moveIsNextMonth : true,
		}
	},
	computed : {
		...mapGetters(['userInfo']),
		now() {
			return moment(new Date());
		}
	},
  methods: {
    // 이전 년 이동
    movePreviousYear() {
			if (this.moveIsPrevYear) {
				this.moveDate = moment(this.moveDate, "YYYY년").subtract("1", "Y").startOf("year").locale("ko").format("YYYY년");
				this.setMoveDate();
			}
		},
		// 다음 년 이동
		moveNextYear() {
			if (this.moveIsNextYear) {
				this.moveDate = moment(this.moveDate, "YYYY년").add("1", "Y").startOf("year").locale("ko").format("YYYY년");
				this.setMoveDate();
			}
		},
    // 이전 월로 이동
    movePreviousMonth() {
			if (this.moveIsPrevMonth) {
				this.moveDate = moment(this.moveDate, "YYYY년 M월").subtract("1", "M").startOf("month").locale("ko").format("YYYY년 M월");
				this.setMoveDate();
			}
    },
    // 다음 월로 이동
    moveNextMonth() {
			if (this.moveIsNextMonth) {
				this.moveDate = moment(this.moveDate, "YYYY년 M월").add("1", "M").startOf("month").locale("ko").format("YYYY년 M월");
				this.setMoveDate();
			}
    },
		setMoveDate() {
			this.moveYear = moment(this.moveDate, "YYYY년 M월").format("YYYY");
			this.moveMonth = moment(this.moveDate, "YYYY년 M월").format("MM");
			this.moveIsNextYear  = (this.moveYear === moment(this.now).format("YYYY")) ? false : true;
			this.moveIsNextMonth = (this.moveYear === moment(this.now).format("YYYY")) && (this.moveMonth === moment(this.now).format("MM")) ? false : true;
			this.moveIsPrevYear = (this.moveYear === moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('YYYY')) ? false : true;
			this.moveIsPrevMonth = (this.moveYear === moment(this.userInfo.info.learnStartDt).subtract(1,'month').format("YYYY")) && (this.moveMonth === moment(this.userInfo.info.learnStartDt).subtract(1,'month').format("MM")) ? false : true;
		},
  },
	created() {
		this.moveDate = this.moveNowDate;
		this.setMoveDate();
	}
};

export default dataMixin;
