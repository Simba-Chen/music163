{
    let view = {
        el: '#app',
        render(data){
            $(this.el).css('background-image',`url(${data.song.cover})`) 
            if($(this.el).find('audio').attr('src') !== data.song.url){
                $(this.el).find('audio').attr('src',`${data.song.url}`)
            }
            $(this.el).find('.cover').attr('src',`${data.song.cover}`)
           
            if(data.status === 'playing'){
                $(this.el).find('.disc-container').addClass('playing')
            }else{
                $(this.el).find('.disc-container').removeClass('playing')
            }
            $(this.el).find('.song-description>h1').text(data.song.name)
            
            let lyrics = data.song.lyrics
            lyrics.split('\n').map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)](.+)/
                let matches = string.match(regex)
                if(matches){
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1] 
                    let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
                    p.setAttribute('data-time',newTime)
                }else{
                    p.textContent = string
                }
                if(p.textContent){
                    $(this.el).find('.lyric > .lines').append(p)
                }
            })
            
        },
        play(){
            $(this.el).find('audio')[0].play()
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        },
        showLyric(time){
            let allP = $(this.el).find('.lyric > .lines > p')
            let p
            for(let i=0;i<allP.length;i++){
                if( i === allP.length-1){
                    p = allP[i]
                    break
                }else{
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')
                    if(currentTime <= time && time < nextTime){
                        p = allP[i]
                        let height = p.getBoundingClientRect().top - $(this.el).find('.lyric > .lines')[0].getBoundingClientRect().top                       
                        $(this.el).find('.lyric > .lines').css('transform',`translateY(-${height - 20}px)`)
                        $(p).addClass('active').siblings('.active').removeClass('active')
                        break
                    }
                }
            }
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: '',
                lyrics: '',
                cover: ''
            }, 
            status: 'paused'
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                console.log()
                Object.assign(this.data.song, {id: song.id,
                    name: song.attributes.name,
                    singer: song.attributes.singer,
                    url: song.attributes.url,
                    lyrics: song.attributes.lyrics,
                    cover: song.attributes.cover
                })
                return song
            }, function (error) {
              // 异常处理
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.getSong(id).then(()=>{
                this.view.render(this.model.data)  
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            $(this.view.el).find('audio').on('ended',()=>{
                window.eventHub.emit('songEnd')
            })
            $(this.view.el).find('audio').on('timeupdate',(e)=>{
                let audio = e.currentTarget
                this.view.showLyric(audio.currentTime)
            })
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
        },
        getSongId(){
            /*通过查询参数来获取最终ID的值*/ 
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            let array = search.split('&').filter((v=>v))
            let id = ''

            for(let i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view,model)
}