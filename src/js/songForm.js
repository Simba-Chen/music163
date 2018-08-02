{
    let view = {
        el: '.page > main',
        template:`<h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                歌名：<input name="name" type="text" value="__name__">
                </label>
            </div>
            <div class="row">
                <label>
                歌手：<input name="singer" type="text" value="__singer__">
                </label>               
            </div>
            <div class="row">
                <label>
                外链：<input name="url" type="text" value="__url__">
                </label>           
            </div>
            <input type="submit">
        </form>`,
        render(data = {}){
            let placeholders = ['name','singer','url','id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }           
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            return song.save().then((newSong)=>{
                let {id,attributes} = newSong
                this.data.id = id  
                this.data.name = attributes.name   
                this.data.singer = attributes.name
                this.data.url = attributes.name
                // 不能将data内部属性重新赋值,只能直接修改data,将原来的data抛弃掉  永远不要使用旧内存的data
                // this.data = {id,...attributes} 
            },(error)=>{
                console.log(error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                .then(()=>{
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)
                })
            })    
        }
    }
    controller.init(view,model)
}