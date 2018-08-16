{
    let view = {
        el: '.page > main > .box',
        template:`
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
            <div class="row">
                <label>
                封面：<input name="cover" type="text" value="__cover__">
                </label>           
            </div>
            <label for="lyrics">歌词：</label>
            <textarea id="lyrics" name="lyrics" cols="40" rows="4">__lyrics__</textarea>
            <input type="submit" value= "SAVE">
        </form>`,
        render(data = {}){
            let placeholders = ['name','singer','url','id','cover','lyrics']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.name){
                $(this.el).prepend('<h3>编辑歌曲</h3>')
            }else{
                $(this.el).prepend('<h3>新建歌曲</h3>')
            }
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
            id: '',
            cover: '',
            lyrics: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
            return song.save().then((newSong)=>{
                this.data.id = newSong.id  
                this.data.name = newSong.name   
                this.data.singer = newSong.singer
                this.data.url = newSong.url
                this.data.lyrics = newSong.lyrics
                // 不能将data内部属性重新赋值,只能直接修改data,将原来的data抛弃掉  永远不要使用旧内存的data
                // this.data = {id,...attributes} 
            },(error)=>{
                console.log(error)
            })
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                data = data || {
                    name: '',
                    url: '',
                    id: '',
                    singer: '',
                    cover: '',
                    lyrics: ''
                }
                if(this.model.data.id){
                    this.model.data = {
                        name: '',
                        url: '',
                        id: '',
                        singer: '',
                        cover: '',
                        lyrics: ''
                    }
                }else{
                    Object.assign(this.model.data,data)
                }
                this.model.data = data
                this.view.render(this.model.data)
            })   
        },
        create(){
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.create(data)
            .then(()=>{
                this.view.reset()
                window.eventHub.emit('create',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        update(){
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
           this.model.update(data).then(()=>{
               window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
           })
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }    
            })    
        }
    }
    controller.init(view,model)
}