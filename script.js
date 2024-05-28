function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search)
    return {
        subject_type: urlParams.get('subject_type'),
        type: urlParams.get('type'),
        user: urlParams.get('user')
    }
}

function relayout(obj) {
    width = 100 / parseInt($(obj).width() / 150)
    $("img").css({
        'width': `${width}vw`,
        'min-height': `calc(${width}vw / 3 * 4)`
    })
    $("div").css('height', `calc(${width}vw / 3 * 4)`)
}

async function fetchAllData() {
    const totalData = []
    params = getUrlParameters()
    const apiEndpoint = `https://api.bgm.tv/v0/users/${params.user}/collections`
    const limit = 50
    let offset = 0
    let hasMoreData = true
    query = ''
    if (params.subject_type != null) {
        query += `&subject_type=${params.subject_type}`
    }
    if (params.type != null) {
        query += `&type=${params.type}`
    }
    while (hasMoreData) {
        const response = await fetch(`${apiEndpoint}?limit=${limit}&offset=${offset}${query}`)
        const data = await response.json()
        totalData.push(...data.data)
        if (data.data.length < limit) {
            hasMoreData = false
        } else {
            offset += limit
        }
    }
    return totalData
}

fetchAllData().then(data => {
    for (i = 0; i < data.length; i++) {
        var img = $("<img/>")
        var src = data[i].subject.images.large
        var link = $('<a></a>')
        let id = data[i].subject_id
        console.log(`${i + 1}.${data[i].subject.name} https://bgm.tv/subject/${id}`)
        img.attr('src', src)
        link.attr('href', `https://bgm.tv/subject/${id}`).attr('target', '_blank').attr('title', `${data[i].subject.name}, ★${data[i].subject.score} #${data[i].subject.rank}`)
        var container = $('<div></div>')
        link.append(img)
        container.append(link)
        $('body').append(container)
    }
    relayout(window)
}).catch(error => {
    console.error('Error loading data:', error)
})

$(window).resize(function () {
    relayout(this)
})