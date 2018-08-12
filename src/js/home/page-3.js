{
    let view = {
        el: '.page-3',
        init(){
          this.$el = $(this.el)  
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvent(this.view.el)
            this.bindEventHub()
        },
        bindEvent(element){
            let timer = null
            $(element).find('input#search').on('input',(e)=>{
                if(timer){
                    window.clearTimeout(timer)
                }
                timer = setTimeout(()=>{
                    let $input = $(e.currentTarget)
                    let value = $input.val().trim()
                    if(value === ''){ return }
                    var query = new AV.Query('Song');
                    query.contains('name', value);
                    query.find().then((result)=>{
                        $('#searchResult').empty()
                        if(result.length === 0){
                            $('#searchResult').html('没有查询到该歌曲')
                        }else if(result.length === 1){
                            for(let i=0;i<result.length;i++){
                                let li = `
                                <a class="playButton" href="./song.html?id=${result[i].id}">
                                    <li data-id ="${result[i].id}">${result[i].attributes.name} - ${result[i].attributes.singer}</li>
                                </a>
                                `
                                $('#searchResult').append(li)
                            }
                        }
                    })
                }, 500);
            })
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
           
        }
    }
    controller.init(view,model)
}