window.eventHub = {
    events: {
        
    },
    emit(eventName, data){//触发triggle 发布
        for(let key in this.events){
            if(eventName === key){
                this.events[key].map((fn)=>{ //桶里面所有的函数都call一遍
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventName,fn){//订阅,监听
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}