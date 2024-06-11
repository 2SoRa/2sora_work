const setDayTagMixin = {
    methods:{
        setDday({bookDiv,bookVerDiv}) {
            if(bookDiv === 'E'){
                return (bookVerDiv?.replace(/D/g,'Day '))
            }
        }
    }
}
export default setDayTagMixin