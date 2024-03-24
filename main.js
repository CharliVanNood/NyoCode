const output = document.getElementById("editor")
const input = document.getElementById("editorInput")

function update() {
    let input_ = input.value
    output.innerHTML = tokenize(input_, "js")
}

input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        var start = this.selectionStart;
        var end = this.selectionEnd;
        
        this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
        
        this.selectionStart = this.selectionEnd = start + 1;

        update()
    }
});

input.addEventListener('scroll', function(e) {
    output.scrollTop = input.scrollTop
})