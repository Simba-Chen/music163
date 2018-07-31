{
    let view = {
        el: '.page > main',
        template:`<h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                    歌名：<input type="text">
                </label>
            </div>
            <div class="row">
                <label>
                    歌手：<input type="text">
                </label>
            </div>
            <div class="row">
                <label>
                    外链：<input type="text">
                </label>
            </div>
            <input type="submit">
        </form>`,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}