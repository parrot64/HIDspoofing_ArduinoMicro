const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL, } = require("url");

function loadEnvFile(filePath)
{
    if (!fs.existsSync(filePath))
    {
        return;
    }

    const text = fs.readFileSync(filePath, "utf8");
    for (const line of text.split(/\r?\n/))
    {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#"))
        {
            continue;
        }

        const eq = trimmed.indexOf("=");
        if (eq <= 0)
        {
            continue;
        }

        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        )
        {
            value = value.slice(1, -1);
        }
        if (process.env[key] === undefined)
        {
            process.env[key] = value;
        }
    }
}

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "public");
const PAGE_SIZE = 1000;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
};


function sendJson(res, status, body)
{
    const payload = JSON.stringify(body);
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
    });
    res.end(payload);
}

function serveStatic(req, res)
{
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = reqUrl.pathname === "/" ? "/index.html" : reqUrl.pathname;
    filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
    const absolute = path.join(PUBLIC_DIR, filePath);

    fs.readFile(absolute,
        (err, data) =>
        {
            if (err)
            {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", });
                res.end("Not found");
                return;
            }
            const ext = path.extname(absolute).toLowerCase();
            res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", });
            res.end(data);
        });
}

function returnFile(aFileName, res)
{
    let filePath = path.normalize(aFileName).replace(/^(\.\.[/\\])+/, "");
    const absolute = path.join(PUBLIC_DIR, filePath);

    fs.readFile(absolute,
        (err, data) =>
        {
            if (err)
            {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", });
                res.end("Not found");
                return;
            }
            const ext = path.extname(absolute).toLowerCase();
            res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", });
            res.end(data);
        });
}

function userInfo(req, res)
{
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);

    const params = new Proxy(
        new URLSearchParams(reqUrl.search),
        {
            get: (searchParams, prop) => searchParams.get(prop),
        });

    console.log(`userInfo: pc:${params.pc} user:${params.user} ip:${params.ip} guid:${params.guid}`);

    returnFile("wp.jpg", res);
}

const server = http.createServer(
    async (req, res) =>
    {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);

        if (req.method === "GET" && reqUrl.pathname === "/api/userInfo")
        {
            await userInfo(req, res);
            return;
        }

        if (req.method === "GET" || req.method === "HEAD")
        {
            serveStatic(req, res);
            return;
        }

        res.writeHead(405, { Allow: "GET, HEAD", });
        res.end("Method Not Allowed");
    });

server.listen(PORT, HOST,
    () =>
    {
        console.log(`server listening on http://${HOST}:${PORT}`);
        if (HOST === "0.0.0.0")
        {
            console.log(`Local:   http://localhost:${PORT}`);
            try
            {
                const os = require("os");
                for (const addrs of Object.values(os.networkInterfaces()))
                {
                    for (const addr of addrs || [])
                    {
                        if (addr.family === "IPv4" && !addr.internal)
                        {
                            console.log(`Network: http://${addr.address}:${PORT}`);
                        }
                    }
                }
            }
            catch
            {
                // ignore interface enumeration errors
            }
        }
    });
