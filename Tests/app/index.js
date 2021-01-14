const http = require('http')
const host = '0.0.0.0'
const port = 9300

const requestListener = (req, res) => {
    req.on('data', chunk => {
        console.log(`Data chunk available: ${chunk}`)
        console.log(JSON.parse(chunk))
    })

    res.writeHead(200)
    res.end("OK")
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})