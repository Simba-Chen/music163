{
    let view = {
        el: '.page-2',
        template: `
            <li>
                <h3>{{song.name}}</h3>
                <p>
                    <svg class="icon icon-sq">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
                    </svg>
                    {{song.singer}}
                </p>
                <a class="playButton" href="./song.html?id={{song.id}}">
                    <svg class="icon icon-play">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                    </svg>
                </a>
            </li>
        `,
        render(data){
            let {songs} = data
            songs.map((song)=>{
                let $li = $(this.template
                    .replace('{{song.name}}',song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                )
                $(this.el).find('.hotPlaylist').append($li)
            })
        },
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let model = {
        data:{
            songs:{}
        },
        findSong(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {
                        id: song.id,
                        name: song.attributes.name,
                        singer: song.attributes.singer
                    }
                })
                return songs
            })
            
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.model.findSong().then(()=>{
                this.view.render(this.model.data)
            })
            // this.view.render(this.model.data.songs)
            this.bindEventHub()
            // console.log(this.model.data.songs)
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}