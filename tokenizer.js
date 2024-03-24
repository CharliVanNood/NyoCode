function tokenize(codeIn, language) {
    let brackets = []
    let bracketsColor = "#0000FF"
    let keys = []

    if (language == "js") {
        brackets = optionsJS["brackets"]["keys"]
        bracketsColor = optionsJS["brackets"]["color"]
        keys = optionsJS["keys"]
    } else if (language == "css") {
        brackets = optionsCSS["brackets"]["keys"]
        bracketsColor = optionsCSS["brackets"]["color"]
        keys = optionsCSS["keys"]
    }

    let codeOut = ""
    let code = codeIn.replace(/</g, "!start!")
    for (let bracket_ = 0; bracket_ < brackets.length; bracket_++) {
        let bracket = brackets[bracket_]
        code = code.replace(new RegExp(bracket.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), " !empty! " + bracket + " !empty! ");
    }
    for (let key_ = 0; key_ < keys.length; key_++) {
        let key = keys[key_][0]
        for (let _key = 0; _key < key.length; _key++) {
            let _key_ = key[_key]
            code = code.replace(new RegExp(_key_.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), " !empty! " + _key_ + " !empty! ");
        }
    }
    code = code.replace(/\./g, " !empty! . !empty! ");
    code = code.replace(/\"/g, " !empty! \" !empty! ");
    code = code.replace(/\'/g, " !empty! \' !empty! ");
    code = code.replace(/\/\//g, " !empty! // !empty! ");
    code = code.replace(/\/\*/g, " !empty! /* !empty! ");
    code = code.replace(/\*\//g, " !empty! */ !empty! ");
    code = code.replace(/\n/g, " !empty! \n !empty! ");
    codeOut = codeOut.replace(/ /g, " !space! ")
    let code_ = code.split(" ")
    let stringStarted = false
    let commentStarted = false
    let comment2Started = false
    for (let key_ = 0; key_ < code_.length; key_++) {
        let key = code_[key_];
        if (brackets.includes(key) && !stringStarted && !commentStarted && !comment2Started) {
            codeOut += "<span style='color: " + bracketsColor + "'>" + key + "</span> "
        } else if (key_ + 2 <= code_.length && code_[key_ + 2] == "(") {
            codeOut += "<span style='color: " + bracketsColor + "'>" + key + "</span> "
        } else if (key_ + 3 <= code_.length && code_[key_ + 3] == "{" && language == "css") {
            codeOut += "<span style='color: " + bracketsColor + "'>" + key + "</span> "
        } else if (key == "/*" || key == "*/") {
            if (!commentStarted) {
                codeOut += "<span style='color: #2e8a15'>" + key + " "
            } else {
                codeOut += key + "</span> "
            }
            commentStarted = !commentStarted
        } else if (key == "//" || (key == "\n" && comment2Started)) {
            if (!comment2Started) {
                codeOut += "<span style='color: #2e8a15'>" + key + " "
            } else {
                codeOut += key + "</span> "
            }
            if (key == "\n") comment2Started = false
            else comment2Started = true
        } else if ((key == "\"" || key == "\'") && !commentStarted && !comment2Started) {
            if (!stringStarted) {
                codeOut += "<span style='color: #ed5311'>" + key + " "
            } else {
                codeOut += key + "</span> "
            }
            stringStarted = !stringStarted
        } else {
            foundKey = false
            for (let keyColor = 0; keyColor < keys.length; keyColor++) {
                let _keys = keys[keyColor][0]
                let keysColor = keys[keyColor][1]
                if (_keys.includes(key) && !stringStarted && !commentStarted && !comment2Started) {
                    codeOut += "<span style='color: " + keysColor + "'>" + key + "</span> "
                    foundKey = true
                }
            }
            if (!foundKey) {
                codeOut += key + " "
            }
        }
    }
    console.log(code_)
    while (codeOut.includes(" !space! ")) {
        codeOut = codeOut.replace(" !space! ", " ")
    }
    while (codeOut.includes(" !empty! ")) {
        codeOut = codeOut.replace(" !empty! ", "")
    }
    while (codeOut.includes("!start!")) {
        codeOut = codeOut.replace("!start!", "&lt")
    }
    return codeOut
}