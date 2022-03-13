var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key2 of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key2) && (copyDefault || key2 !== "default"))
        __defProp(target, key2, { get: () => module2[key2], enumerable: !(desc = __getOwnPropDesc(module2, key2)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var import_node_worker_threads, s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    import_node_worker_threads = require("worker_threads");
    init_install_fetch();
    globalThis.DOMException || (() => {
      const port = new import_node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0;
      while (position !== part.size) {
        const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL, options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              headers.set("Location", locationURL);
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), reject) : (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), reject);
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function __fetch_polyfill() {
  Object.defineProperties(globalThis, {
    fetch: {
      enumerable: true,
      configurable: true,
      value: fetch2
    },
    Response: {
      enumerable: true,
      configurable: true,
      value: Response2
    },
    Request: {
      enumerable: true,
      configurable: true,
      value: Request2
    },
    Headers: {
      enumerable: true,
      configurable: true,
      value: Headers2
    }
  });
}
var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_util, import_node_url, import_net, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _parts, _type, _size, _a, _Blob, Blob2, Blob$1, _lastModified, _name, _a2, _File, File, t, i, h, r, m, f2, e, x, _d, _a3, FormData, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, Request2, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    import_node_http = __toESM(require("http"), 1);
    import_node_https = __toESM(require("https"), 1);
    import_node_zlib = __toESM(require("zlib"), 1);
    import_node_stream = __toESM(require("stream"), 1);
    import_node_util = require("util");
    import_node_url = require("url");
    import_net = require("net");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop4() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry4 = this._queue.shift();
              this._queueTotalSize -= entry4.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry4.buffer, entry4.byteOffset, entry4.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable3 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable3, "writable", "ReadableWritablePair");
          assertWritableStream(writable3, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable3 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable3 = stream._writable;
              const state = writable3._state;
              if (state === "erroring") {
                throw writable3._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder2.encode(element);
          }
          __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
          __privateGet(this, _parts).push(part);
        }
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
  }
});

// .svelte-kit/output/server/chunks/index-08869495.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css4) => css4.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true && boolean_attributes.has(name) ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
var current_component, boolean_attributes, escaped, missing_component, on_destroy;
var init_index_08869495 = __esm({
  ".svelte-kit/output/server/chunks/index-08869495.js"() {
    Promise.resolve();
    boolean_attributes = /* @__PURE__ */ new Set([
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]);
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/entries/pages/layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/layout.svelte.js"() {
    init_index_08869495();
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css,
  entry: () => entry,
  js: () => js,
  module: () => layout_svelte_exports
});
var entry, js, css;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_layout_svelte();
    entry = "layout.svelte-8569d249.js";
    js = ["layout.svelte-8569d249.js", "chunks/vendor-1b4702e0.js"];
    css = [];
  }
});

// .svelte-kit/output/server/entries/pages/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/error.svelte.js"() {
    init_index_08869495();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css2,
  entry: () => entry2,
  js: () => js2,
  module: () => error_svelte_exports
});
var entry2, js2, css2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_error_svelte();
    entry2 = "error.svelte-2608d40b.js";
    js2 = ["error.svelte-2608d40b.js", "chunks/vendor-1b4702e0.js"];
    css2 = [];
  }
});

// node_modules/fast-text-encoding/text.min.js
var require_text_min = __commonJS({
  "node_modules/fast-text-encoding/text.min.js"(exports) {
    (function(l) {
      function m2() {
      }
      function k(a, c) {
        a = a === void 0 ? "utf-8" : a;
        c = c === void 0 ? { fatal: false } : c;
        if (r2.indexOf(a.toLowerCase()) === -1)
          throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + a + "') is invalid.");
        if (c.fatal)
          throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
      }
      function t2(a) {
        return Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString("utf-8");
      }
      function u(a) {
        var c = URL.createObjectURL(new Blob([a], { type: "text/plain;charset=UTF-8" }));
        try {
          var f3 = new XMLHttpRequest();
          f3.open("GET", c, false);
          f3.send();
          return f3.responseText;
        } catch (e2) {
          return q(a);
        } finally {
          URL.revokeObjectURL(c);
        }
      }
      function q(a) {
        for (var c = 0, f3 = Math.min(65536, a.length + 1), e2 = new Uint16Array(f3), h2 = [], d = 0; ; ) {
          var b = c < a.length;
          if (!b || d >= f3 - 1) {
            h2.push(String.fromCharCode.apply(null, e2.subarray(0, d)));
            if (!b)
              return h2.join("");
            a = a.subarray(c);
            d = c = 0;
          }
          b = a[c++];
          if ((b & 128) === 0)
            e2[d++] = b;
          else if ((b & 224) === 192) {
            var g = a[c++] & 63;
            e2[d++] = (b & 31) << 6 | g;
          } else if ((b & 240) === 224) {
            g = a[c++] & 63;
            var n = a[c++] & 63;
            e2[d++] = (b & 31) << 12 | g << 6 | n;
          } else if ((b & 248) === 240) {
            g = a[c++] & 63;
            n = a[c++] & 63;
            var v = a[c++] & 63;
            b = (b & 7) << 18 | g << 12 | n << 6 | v;
            65535 < b && (b -= 65536, e2[d++] = b >>> 10 & 1023 | 55296, b = 56320 | b & 1023);
            e2[d++] = b;
          }
        }
      }
      if (l.TextEncoder && l.TextDecoder)
        return false;
      var r2 = ["utf-8", "utf8", "unicode-1-1-utf-8"];
      Object.defineProperty(m2.prototype, "encoding", { value: "utf-8" });
      m2.prototype.encode = function(a, c) {
        c = c === void 0 ? { stream: false } : c;
        if (c.stream)
          throw Error("Failed to encode: the 'stream' option is unsupported.");
        c = 0;
        for (var f3 = a.length, e2 = 0, h2 = Math.max(32, f3 + (f3 >>> 1) + 7), d = new Uint8Array(h2 >>> 3 << 3); c < f3; ) {
          var b = a.charCodeAt(c++);
          if (55296 <= b && 56319 >= b) {
            if (c < f3) {
              var g = a.charCodeAt(c);
              (g & 64512) === 56320 && (++c, b = ((b & 1023) << 10) + (g & 1023) + 65536);
            }
            if (55296 <= b && 56319 >= b)
              continue;
          }
          e2 + 4 > d.length && (h2 += 8, h2 *= 1 + c / a.length * 2, h2 = h2 >>> 3 << 3, g = new Uint8Array(h2), g.set(d), d = g);
          if ((b & 4294967168) === 0)
            d[e2++] = b;
          else {
            if ((b & 4294965248) === 0)
              d[e2++] = b >>> 6 & 31 | 192;
            else if ((b & 4294901760) === 0)
              d[e2++] = b >>> 12 & 15 | 224, d[e2++] = b >>> 6 & 63 | 128;
            else if ((b & 4292870144) === 0)
              d[e2++] = b >>> 18 & 7 | 240, d[e2++] = b >>> 12 & 63 | 128, d[e2++] = b >>> 6 & 63 | 128;
            else
              continue;
            d[e2++] = b & 63 | 128;
          }
        }
        return d.slice ? d.slice(0, e2) : d.subarray(0, e2);
      };
      Object.defineProperty(k.prototype, "encoding", { value: "utf-8" });
      Object.defineProperty(k.prototype, "fatal", { value: false });
      Object.defineProperty(k.prototype, "ignoreBOM", { value: false });
      var p = q;
      typeof Buffer === "function" && Buffer.from ? p = t2 : typeof Blob === "function" && typeof URL === "function" && typeof URL.createObjectURL === "function" && (p = u);
      k.prototype.decode = function(a, c) {
        c = c === void 0 ? { stream: false } : c;
        if (c.stream)
          throw Error("Failed to decode: the 'stream' option is unsupported.");
        a = a instanceof Uint8Array ? a : a.buffer instanceof ArrayBuffer ? new Uint8Array(a.buffer) : new Uint8Array(a);
        return p(a);
      };
      l.TextEncoder = m2;
      l.TextDecoder = k;
    })(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports);
  }
});

// node_modules/browser-tabs-lock/processLock.js
var require_processLock = __commonJS({
  "node_modules/browser-tabs-lock/processLock.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProcessLocking = function() {
      function ProcessLocking2() {
        var _this = this;
        this.locked = /* @__PURE__ */ new Map();
        this.addToLocked = function(key2, toAdd) {
          var callbacks = _this.locked.get(key2);
          if (callbacks === void 0) {
            if (toAdd === void 0) {
              _this.locked.set(key2, []);
            } else {
              _this.locked.set(key2, [toAdd]);
            }
          } else {
            if (toAdd !== void 0) {
              callbacks.unshift(toAdd);
              _this.locked.set(key2, callbacks);
            }
          }
        };
        this.isLocked = function(key2) {
          return _this.locked.has(key2);
        };
        this.lock = function(key2) {
          return new Promise(function(resolve2, reject) {
            if (_this.isLocked(key2)) {
              _this.addToLocked(key2, resolve2);
            } else {
              _this.addToLocked(key2);
              resolve2();
            }
          });
        };
        this.unlock = function(key2) {
          var callbacks = _this.locked.get(key2);
          if (callbacks === void 0 || callbacks.length === 0) {
            _this.locked.delete(key2);
            return;
          }
          var toCall = callbacks.pop();
          _this.locked.set(key2, callbacks);
          if (toCall !== void 0) {
            setTimeout(toCall, 0);
          }
        };
      }
      ProcessLocking2.getInstance = function() {
        if (ProcessLocking2.instance === void 0) {
          ProcessLocking2.instance = new ProcessLocking2();
        }
        return ProcessLocking2.instance;
      };
      return ProcessLocking2;
    }();
    function getLock() {
      return ProcessLocking.getInstance();
    }
    exports.default = getLock;
  }
});

// node_modules/browser-tabs-lock/index.js
var require_browser_tabs_lock = __commonJS({
  "node_modules/browser-tabs-lock/index.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject(e2);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e2) {
            reject(e2);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : new P(function(resolve3) {
            resolve3(result.value);
          }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t2[0] & 1)
          throw t2[1];
        return t2[1];
      }, trys: [], ops: [] }, f3, y, t2, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f3)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f3 = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done)
              return t2;
            if (y = 0, t2)
              op = [op[0] & 2, t2.value];
            switch (op[0]) {
              case 0:
              case 1:
                t2 = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t2[1]) {
                  _.label = t2[1];
                  t2 = op;
                  break;
                }
                if (t2 && _.label < t2[2]) {
                  _.label = t2[2];
                  _.ops.push(op);
                  break;
                }
                if (t2[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e2) {
            op = [6, e2];
            y = 0;
          } finally {
            f3 = t2 = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var processLock_1 = require_processLock();
    var LOCK_STORAGE_KEY = "browser-tabs-lock-key";
    function delay(milliseconds) {
      return new Promise(function(resolve2) {
        return setTimeout(resolve2, milliseconds);
      });
    }
    function generateRandomString(length) {
      var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var randomstring = "";
      for (var i2 = 0; i2 < length; i2++) {
        var INDEX = Math.floor(Math.random() * CHARS.length);
        randomstring += CHARS[INDEX];
      }
      return randomstring;
    }
    function getLockId() {
      return Date.now().toString() + generateRandomString(15);
    }
    var SuperTokensLock = function() {
      function SuperTokensLock2() {
        this.acquiredIatSet = /* @__PURE__ */ new Set();
        this.id = getLockId();
        this.acquireLock = this.acquireLock.bind(this);
        this.releaseLock = this.releaseLock.bind(this);
        this.releaseLock__private__ = this.releaseLock__private__.bind(this);
        this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this);
        this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this);
        if (SuperTokensLock2.waiters === void 0) {
          SuperTokensLock2.waiters = [];
        }
      }
      SuperTokensLock2.prototype.acquireLock = function(lockKey, timeout) {
        if (timeout === void 0) {
          timeout = 5e3;
        }
        return __awaiter(this, void 0, void 0, function() {
          var iat, MAX_TIME, STORAGE_KEY, STORAGE, lockObj, TIMEOUT_KEY, lockObjPostDelay;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                iat = Date.now() + generateRandomString(4);
                MAX_TIME = Date.now() + timeout;
                STORAGE_KEY = LOCK_STORAGE_KEY + "-" + lockKey;
                STORAGE = window.localStorage;
                _a4.label = 1;
              case 1:
                if (!(Date.now() < MAX_TIME))
                  return [3, 8];
                return [4, delay(30)];
              case 2:
                _a4.sent();
                lockObj = STORAGE.getItem(STORAGE_KEY);
                if (!(lockObj === null))
                  return [3, 5];
                TIMEOUT_KEY = this.id + "-" + lockKey + "-" + iat;
                return [4, delay(Math.floor(Math.random() * 25))];
              case 3:
                _a4.sent();
                STORAGE.setItem(STORAGE_KEY, JSON.stringify({
                  id: this.id,
                  iat,
                  timeoutKey: TIMEOUT_KEY,
                  timeAcquired: Date.now(),
                  timeRefreshed: Date.now()
                }));
                return [4, delay(30)];
              case 4:
                _a4.sent();
                lockObjPostDelay = STORAGE.getItem(STORAGE_KEY);
                if (lockObjPostDelay !== null) {
                  lockObjPostDelay = JSON.parse(lockObjPostDelay);
                  if (lockObjPostDelay.id === this.id && lockObjPostDelay.iat === iat) {
                    this.acquiredIatSet.add(iat);
                    this.refreshLockWhileAcquired(STORAGE_KEY, iat);
                    return [2, true];
                  }
                }
                return [3, 7];
              case 5:
                SuperTokensLock2.lockCorrector();
                return [4, this.waitForSomethingToChange(MAX_TIME)];
              case 6:
                _a4.sent();
                _a4.label = 7;
              case 7:
                iat = Date.now() + generateRandomString(4);
                return [3, 1];
              case 8:
                return [2, false];
            }
          });
        });
      };
      SuperTokensLock2.prototype.refreshLockWhileAcquired = function(storageKey, iat) {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a4) {
            setTimeout(function() {
              return __awaiter(_this, void 0, void 0, function() {
                var STORAGE, lockObj;
                return __generator(this, function(_a5) {
                  switch (_a5.label) {
                    case 0:
                      return [4, processLock_1.default().lock(iat)];
                    case 1:
                      _a5.sent();
                      if (!this.acquiredIatSet.has(iat)) {
                        processLock_1.default().unlock(iat);
                        return [2];
                      }
                      STORAGE = window.localStorage;
                      lockObj = STORAGE.getItem(storageKey);
                      if (lockObj !== null) {
                        lockObj = JSON.parse(lockObj);
                        lockObj.timeRefreshed = Date.now();
                        STORAGE.setItem(storageKey, JSON.stringify(lockObj));
                        processLock_1.default().unlock(iat);
                      } else {
                        processLock_1.default().unlock(iat);
                        return [2];
                      }
                      this.refreshLockWhileAcquired(storageKey, iat);
                      return [2];
                  }
                });
              });
            }, 1e3);
            return [2];
          });
        });
      };
      SuperTokensLock2.prototype.waitForSomethingToChange = function(MAX_TIME) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, new Promise(function(resolve2) {
                  var resolvedCalled = false;
                  var startedAt = Date.now();
                  var MIN_TIME_TO_WAIT = 50;
                  var removedListeners = false;
                  function stopWaiting() {
                    if (!removedListeners) {
                      window.removeEventListener("storage", stopWaiting);
                      SuperTokensLock2.removeFromWaiting(stopWaiting);
                      clearTimeout(timeOutId);
                      removedListeners = true;
                    }
                    if (!resolvedCalled) {
                      resolvedCalled = true;
                      var timeToWait = MIN_TIME_TO_WAIT - (Date.now() - startedAt);
                      if (timeToWait > 0) {
                        setTimeout(resolve2, timeToWait);
                      } else {
                        resolve2();
                      }
                    }
                  }
                  window.addEventListener("storage", stopWaiting);
                  SuperTokensLock2.addToWaiting(stopWaiting);
                  var timeOutId = setTimeout(stopWaiting, Math.max(0, MAX_TIME - Date.now()));
                })];
              case 1:
                _a4.sent();
                return [2];
            }
          });
        });
      };
      SuperTokensLock2.addToWaiting = function(func) {
        this.removeFromWaiting(func);
        if (SuperTokensLock2.waiters === void 0) {
          return;
        }
        SuperTokensLock2.waiters.push(func);
      };
      SuperTokensLock2.removeFromWaiting = function(func) {
        if (SuperTokensLock2.waiters === void 0) {
          return;
        }
        SuperTokensLock2.waiters = SuperTokensLock2.waiters.filter(function(i2) {
          return i2 !== func;
        });
      };
      SuperTokensLock2.notifyWaiters = function() {
        if (SuperTokensLock2.waiters === void 0) {
          return;
        }
        var waiters = SuperTokensLock2.waiters.slice();
        waiters.forEach(function(i2) {
          return i2();
        });
      };
      SuperTokensLock2.prototype.releaseLock = function(lockKey) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, this.releaseLock__private__(lockKey)];
              case 1:
                return [2, _a4.sent()];
            }
          });
        });
      };
      SuperTokensLock2.prototype.releaseLock__private__ = function(lockKey) {
        return __awaiter(this, void 0, void 0, function() {
          var STORAGE, STORAGE_KEY, lockObj;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                STORAGE = window.localStorage;
                STORAGE_KEY = LOCK_STORAGE_KEY + "-" + lockKey;
                lockObj = STORAGE.getItem(STORAGE_KEY);
                if (lockObj === null) {
                  return [2];
                }
                lockObj = JSON.parse(lockObj);
                if (!(lockObj.id === this.id))
                  return [3, 2];
                return [4, processLock_1.default().lock(lockObj.iat)];
              case 1:
                _a4.sent();
                this.acquiredIatSet.delete(lockObj.iat);
                STORAGE.removeItem(STORAGE_KEY);
                processLock_1.default().unlock(lockObj.iat);
                SuperTokensLock2.notifyWaiters();
                _a4.label = 2;
              case 2:
                return [2];
            }
          });
        });
      };
      SuperTokensLock2.lockCorrector = function() {
        var MIN_ALLOWED_TIME = Date.now() - 5e3;
        var STORAGE = window.localStorage;
        var KEYS = Object.keys(STORAGE);
        var notifyWaiters = false;
        for (var i2 = 0; i2 < KEYS.length; i2++) {
          var LOCK_KEY = KEYS[i2];
          if (LOCK_KEY.includes(LOCK_STORAGE_KEY)) {
            var lockObj = STORAGE.getItem(LOCK_KEY);
            if (lockObj !== null) {
              lockObj = JSON.parse(lockObj);
              if (lockObj.timeRefreshed === void 0 && lockObj.timeAcquired < MIN_ALLOWED_TIME || lockObj.timeRefreshed !== void 0 && lockObj.timeRefreshed < MIN_ALLOWED_TIME) {
                STORAGE.removeItem(LOCK_KEY);
                notifyWaiters = true;
              }
            }
          }
        }
        if (notifyWaiters) {
          SuperTokensLock2.notifyWaiters();
        }
      };
      SuperTokensLock2.waiters = void 0;
      return SuperTokensLock2;
    }();
    exports.default = SuperTokensLock;
  }
});

// node_modules/unfetch/dist/unfetch.js
var require_unfetch = __commonJS({
  "node_modules/unfetch/dist/unfetch.js"(exports, module2) {
    module2.exports = function(e2, n) {
      return n = n || {}, new Promise(function(t2, r2) {
        var s3 = new XMLHttpRequest(), o = [], u = [], i2 = {}, a = function() {
          return { ok: (s3.status / 100 | 0) == 2, statusText: s3.statusText, status: s3.status, url: s3.responseURL, text: function() {
            return Promise.resolve(s3.responseText);
          }, json: function() {
            return Promise.resolve(s3.responseText).then(JSON.parse);
          }, blob: function() {
            return Promise.resolve(new Blob([s3.response]));
          }, clone: a, headers: { keys: function() {
            return o;
          }, entries: function() {
            return u;
          }, get: function(e3) {
            return i2[e3.toLowerCase()];
          }, has: function(e3) {
            return e3.toLowerCase() in i2;
          } } };
        };
        for (var l in s3.open(n.method || "get", e2, true), s3.onload = function() {
          s3.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(e3, n2, t3) {
            o.push(n2 = n2.toLowerCase()), u.push([n2, t3]), i2[n2] = i2[n2] ? i2[n2] + "," + t3 : t3;
          }), t2(a());
        }, s3.onerror = r2, s3.withCredentials = n.credentials == "include", n.headers)
          s3.setRequestHeader(l, n.headers[l]);
        s3.send(n.body || null);
      });
    };
  }
});

// node_modules/es-cookie/src/es-cookie.js
var require_es_cookie = __commonJS({
  "node_modules/es-cookie/src/es-cookie.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t2) {
        for (var s3, i2 = 1, n = arguments.length; i2 < n; i2++) {
          s3 = arguments[i2];
          for (var p in s3)
            if (Object.prototype.hasOwnProperty.call(s3, p))
              t2[p] = s3[p];
        }
        return t2;
      };
      return __assign.apply(this, arguments);
    };
    exports.__esModule = true;
    function stringifyAttribute(name, value) {
      if (!value) {
        return "";
      }
      var stringified = "; " + name;
      if (value === true) {
        return stringified;
      }
      return stringified + "=" + value;
    }
    function stringifyAttributes(attributes) {
      if (typeof attributes.expires === "number") {
        var expires = new Date();
        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e5);
        attributes.expires = expires;
      }
      return stringifyAttribute("Expires", attributes.expires ? attributes.expires.toUTCString() : "") + stringifyAttribute("Domain", attributes.domain) + stringifyAttribute("Path", attributes.path) + stringifyAttribute("Secure", attributes.secure) + stringifyAttribute("SameSite", attributes.sameSite);
    }
    function encode2(name, value, attributes) {
      return encodeURIComponent(name).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(value).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + stringifyAttributes(attributes);
    }
    exports.encode = encode2;
    function parse(cookieString) {
      var result = {};
      var cookies = cookieString ? cookieString.split("; ") : [];
      var rdecode = /(%[\dA-F]{2})+/gi;
      for (var i2 = 0; i2 < cookies.length; i2++) {
        var parts = cookies[i2].split("=");
        var cookie = parts.slice(1).join("=");
        if (cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }
        try {
          var name_1 = parts[0].replace(rdecode, decodeURIComponent);
          result[name_1] = cookie.replace(rdecode, decodeURIComponent);
        } catch (e2) {
        }
      }
      return result;
    }
    exports.parse = parse;
    function getAll() {
      return parse(document.cookie);
    }
    exports.getAll = getAll;
    function get(name) {
      return getAll()[name];
    }
    exports.get = get;
    function set(name, value, attributes) {
      document.cookie = encode2(name, value, __assign({ path: "/" }, attributes));
    }
    exports.set = set;
    function remove(name, attributes) {
      set(name, "", __assign(__assign({}, attributes), { expires: -1 }));
    }
    exports.remove = remove;
  }
});

// node_modules/@auth0/auth0-spa-js/dist/lib/auth0-spa-js.cjs.js
var require_auth0_spa_js_cjs = __commonJS({
  "node_modules/@auth0/auth0-spa-js/dist/lib/auth0-spa-js.cjs.js"(exports, module2) {
    "use strict";
    require_text_min();
    var Lock = require_browser_tabs_lock();
    var fetch3 = require_unfetch();
    var Cookies = require_es_cookie();
    function _interopDefaultLegacy(e2) {
      return e2 && typeof e2 === "object" && "default" in e2 ? e2 : { "default": e2 };
    }
    function _interopNamespace(e2) {
      if (e2 && e2.__esModule)
        return e2;
      var n = /* @__PURE__ */ Object.create(null);
      if (e2) {
        Object.keys(e2).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e2, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e2[k];
              }
            });
          }
        });
      }
      n["default"] = e2;
      return Object.freeze(n);
    }
    var Lock__default = /* @__PURE__ */ _interopDefaultLegacy(Lock);
    var fetch__default = /* @__PURE__ */ _interopDefaultLegacy(fetch3);
    var Cookies__namespace = /* @__PURE__ */ _interopNamespace(Cookies);
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function() {
      __assign = Object.assign || function __assign2(t2) {
        for (var s3, i2 = 1, n = arguments.length; i2 < n; i2++) {
          s3 = arguments[i2];
          for (var p in s3)
            if (Object.prototype.hasOwnProperty.call(s3, p))
              t2[p] = s3[p];
        }
        return t2;
      };
      return __assign.apply(this, arguments);
    };
    function __rest(s3, e2) {
      var t2 = {};
      for (var p in s3)
        if (Object.prototype.hasOwnProperty.call(s3, p) && e2.indexOf(p) < 0)
          t2[p] = s3[p];
      if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i2 = 0, p = Object.getOwnPropertySymbols(s3); i2 < p.length; i2++) {
          if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p[i2]))
            t2[p[i2]] = s3[p[i2]];
        }
      return t2;
    }
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve3) {
          resolve3(value);
        });
      }
      return new (P || (P = Promise))(function(resolve3, reject2) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject2(e2);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e2) {
            reject2(e2);
          }
        }
        function step(result) {
          result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t2[0] & 1)
          throw t2[1];
        return t2[1];
      }, trys: [], ops: [] }, f4, y, t2, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f4)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f4 = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done)
              return t2;
            if (y = 0, t2)
              op = [op[0] & 2, t2.value];
            switch (op[0]) {
              case 0:
              case 1:
                t2 = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t2[1]) {
                  _.label = t2[1];
                  t2 = op;
                  break;
                }
                if (t2 && _.label < t2[2]) {
                  _.label = t2[2];
                  _.ops.push(op);
                  break;
                }
                if (t2[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e2) {
            op = [6, e2];
            y = 0;
          } finally {
            f4 = t2 = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    }
    function __read(o, n) {
      var m2 = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m2)
        return o;
      var i2 = m2.call(o), r2, ar = [], e2;
      try {
        while ((n === void 0 || n-- > 0) && !(r2 = i2.next()).done)
          ar.push(r2.value);
      } catch (error2) {
        e2 = { error: error2 };
      } finally {
        try {
          if (r2 && !r2.done && (m2 = i2["return"]))
            m2.call(i2);
        } finally {
          if (e2)
            throw e2.error;
        }
      }
      return ar;
    }
    function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
          if (ar || !(i2 in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    }
    var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function createCommonjsModule(fn, module3) {
      return module3 = { exports: {} }, fn(module3, module3.exports), module3.exports;
    }
    var check = function(it) {
      return it && it.Math == Math && it;
    };
    var global_1 = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof commonjsGlobal2 == "object" && commonjsGlobal2) || function() {
      return this;
    }() || Function("return this")();
    var fails = function(exec2) {
      try {
        return !!exec2();
      } catch (error2) {
        return true;
      }
    };
    var descriptors = !fails(function() {
      return Object.defineProperty({}, 1, { get: function() {
        return 7;
      } })[1] != 7;
    });
    var functionBindNative = !fails(function() {
      var test2 = function() {
      }.bind();
      return typeof test2 != "function" || test2.hasOwnProperty("prototype");
    });
    var call$2 = Function.prototype.call;
    var functionCall = functionBindNative ? call$2.bind(call$2) : function() {
      return call$2.apply(call$2, arguments);
    };
    var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
    var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
    var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);
    var f$7 = NASHORN_BUG ? function propertyIsEnumerable(V) {
      var descriptor = getOwnPropertyDescriptor$2(this, V);
      return !!descriptor && descriptor.enumerable;
    } : $propertyIsEnumerable$1;
    var objectPropertyIsEnumerable = {
      f: f$7
    };
    var createPropertyDescriptor = function(bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value
      };
    };
    var FunctionPrototype$2 = Function.prototype;
    var bind$2 = FunctionPrototype$2.bind;
    var call$1 = FunctionPrototype$2.call;
    var uncurryThis = functionBindNative && bind$2.bind(call$1, call$1);
    var functionUncurryThis = functionBindNative ? function(fn) {
      return fn && uncurryThis(fn);
    } : function(fn) {
      return fn && function() {
        return call$1.apply(fn, arguments);
      };
    };
    var toString$1 = functionUncurryThis({}.toString);
    var stringSlice$3 = functionUncurryThis("".slice);
    var classofRaw = function(it) {
      return stringSlice$3(toString$1(it), 8, -1);
    };
    var Object$5 = global_1.Object;
    var split = functionUncurryThis("".split);
    var indexedObject = fails(function() {
      return !Object$5("z").propertyIsEnumerable(0);
    }) ? function(it) {
      return classofRaw(it) == "String" ? split(it, "") : Object$5(it);
    } : Object$5;
    var TypeError$g = global_1.TypeError;
    var requireObjectCoercible = function(it) {
      if (it == void 0)
        throw TypeError$g("Can't call method on " + it);
      return it;
    };
    var toIndexedObject = function(it) {
      return indexedObject(requireObjectCoercible(it));
    };
    var isCallable = function(argument) {
      return typeof argument == "function";
    };
    var isObject = function(it) {
      return typeof it == "object" ? it !== null : isCallable(it);
    };
    var aFunction = function(argument) {
      return isCallable(argument) ? argument : void 0;
    };
    var getBuiltIn = function(namespace, method) {
      return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
    };
    var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);
    var engineUserAgent = getBuiltIn("navigator", "userAgent") || "";
    var process2 = global_1.process;
    var Deno = global_1.Deno;
    var versions = process2 && process2.versions || Deno && Deno.version;
    var v8 = versions && versions.v8;
    var match;
    var version$1;
    if (v8) {
      match = v8.split(".");
      version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
    }
    if (!version$1 && engineUserAgent) {
      match = engineUserAgent.match(/Edge\/(\d+)/);
      if (!match || match[1] >= 74) {
        match = engineUserAgent.match(/Chrome\/(\d+)/);
        if (match)
          version$1 = +match[1];
      }
    }
    var engineV8Version = version$1;
    var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function() {
      var symbol = Symbol();
      return !String(symbol) || !(Object(symbol) instanceof Symbol) || !Symbol.sham && engineV8Version && engineV8Version < 41;
    });
    var useSymbolAsUid = nativeSymbol && !Symbol.sham && typeof Symbol.iterator == "symbol";
    var Object$4 = global_1.Object;
    var isSymbol = useSymbolAsUid ? function(it) {
      return typeof it == "symbol";
    } : function(it) {
      var $Symbol2 = getBuiltIn("Symbol");
      return isCallable($Symbol2) && objectIsPrototypeOf($Symbol2.prototype, Object$4(it));
    };
    var String$4 = global_1.String;
    var tryToString = function(argument) {
      try {
        return String$4(argument);
      } catch (error2) {
        return "Object";
      }
    };
    var TypeError$f = global_1.TypeError;
    var aCallable = function(argument) {
      if (isCallable(argument))
        return argument;
      throw TypeError$f(tryToString(argument) + " is not a function");
    };
    var getMethod = function(V, P) {
      var func = V[P];
      return func == null ? void 0 : aCallable(func);
    };
    var TypeError$e = global_1.TypeError;
    var ordinaryToPrimitive = function(input, pref) {
      var fn, val;
      if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input)))
        return val;
      if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input)))
        return val;
      if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input)))
        return val;
      throw TypeError$e("Can't convert object to primitive value");
    };
    var defineProperty$6 = Object.defineProperty;
    var setGlobal = function(key2, value) {
      try {
        defineProperty$6(global_1, key2, { value, configurable: true, writable: true });
      } catch (error2) {
        global_1[key2] = value;
      }
      return value;
    };
    var SHARED = "__core-js_shared__";
    var store$1 = global_1[SHARED] || setGlobal(SHARED, {});
    var sharedStore = store$1;
    var shared = createCommonjsModule(function(module3) {
      (module3.exports = function(key2, value) {
        return sharedStore[key2] || (sharedStore[key2] = value !== void 0 ? value : {});
      })("versions", []).push({
        version: "3.21.0",
        mode: "global",
        copyright: "\xA9 2014-2022 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.21.0/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
    });
    var Object$3 = global_1.Object;
    var toObject = function(argument) {
      return Object$3(requireObjectCoercible(argument));
    };
    var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);
    var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key2) {
      return hasOwnProperty(toObject(it), key2);
    };
    var id = 0;
    var postfix = Math.random();
    var toString = functionUncurryThis(1 .toString);
    var uid = function(key2) {
      return "Symbol(" + (key2 === void 0 ? "" : key2) + ")_" + toString(++id + postfix, 36);
    };
    var WellKnownSymbolsStore$1 = shared("wks");
    var Symbol$1 = global_1.Symbol;
    var symbolFor = Symbol$1 && Symbol$1["for"];
    var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;
    var wellKnownSymbol = function(name) {
      if (!hasOwnProperty_1(WellKnownSymbolsStore$1, name) || !(nativeSymbol || typeof WellKnownSymbolsStore$1[name] == "string")) {
        var description = "Symbol." + name;
        if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
          WellKnownSymbolsStore$1[name] = Symbol$1[name];
        } else if (useSymbolAsUid && symbolFor) {
          WellKnownSymbolsStore$1[name] = symbolFor(description);
        } else {
          WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
        }
      }
      return WellKnownSymbolsStore$1[name];
    };
    var TypeError$d = global_1.TypeError;
    var TO_PRIMITIVE$1 = wellKnownSymbol("toPrimitive");
    var toPrimitive = function(input, pref) {
      if (!isObject(input) || isSymbol(input))
        return input;
      var exoticToPrim = getMethod(input, TO_PRIMITIVE$1);
      var result;
      if (exoticToPrim) {
        if (pref === void 0)
          pref = "default";
        result = functionCall(exoticToPrim, input, pref);
        if (!isObject(result) || isSymbol(result))
          return result;
        throw TypeError$d("Can't convert object to primitive value");
      }
      if (pref === void 0)
        pref = "number";
      return ordinaryToPrimitive(input, pref);
    };
    var toPropertyKey = function(argument) {
      var key2 = toPrimitive(argument, "string");
      return isSymbol(key2) ? key2 : key2 + "";
    };
    var document$1 = global_1.document;
    var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);
    var documentCreateElement = function(it) {
      return EXISTS$1 ? document$1.createElement(it) : {};
    };
    var ie8DomDefine = !descriptors && !fails(function() {
      return Object.defineProperty(documentCreateElement("div"), "a", {
        get: function() {
          return 7;
        }
      }).a != 7;
    });
    var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
    var f$6 = descriptors ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor2(O, P) {
      O = toIndexedObject(O);
      P = toPropertyKey(P);
      if (ie8DomDefine)
        try {
          return $getOwnPropertyDescriptor$2(O, P);
        } catch (error2) {
        }
      if (hasOwnProperty_1(O, P))
        return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
    };
    var objectGetOwnPropertyDescriptor = {
      f: f$6
    };
    var v8PrototypeDefineBug = descriptors && fails(function() {
      return Object.defineProperty(function() {
      }, "prototype", {
        value: 42,
        writable: false
      }).prototype != 42;
    });
    var String$3 = global_1.String;
    var TypeError$c = global_1.TypeError;
    var anObject = function(argument) {
      if (isObject(argument))
        return argument;
      throw TypeError$c(String$3(argument) + " is not an object");
    };
    var TypeError$b = global_1.TypeError;
    var $defineProperty$1 = Object.defineProperty;
    var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
    var ENUMERABLE = "enumerable";
    var CONFIGURABLE$1 = "configurable";
    var WRITABLE = "writable";
    var f$5 = descriptors ? v8PrototypeDefineBug ? function defineProperty2(O, P, Attributes) {
      anObject(O);
      P = toPropertyKey(P);
      anObject(Attributes);
      if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
        var current = $getOwnPropertyDescriptor$1(O, P);
        if (current && current[WRITABLE]) {
          O[P] = Attributes.value;
          Attributes = {
            configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
            enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
            writable: false
          };
        }
      }
      return $defineProperty$1(O, P, Attributes);
    } : $defineProperty$1 : function defineProperty2(O, P, Attributes) {
      anObject(O);
      P = toPropertyKey(P);
      anObject(Attributes);
      if (ie8DomDefine)
        try {
          return $defineProperty$1(O, P, Attributes);
        } catch (error2) {
        }
      if ("get" in Attributes || "set" in Attributes)
        throw TypeError$b("Accessors not supported");
      if ("value" in Attributes)
        O[P] = Attributes.value;
      return O;
    };
    var objectDefineProperty = {
      f: f$5
    };
    var createNonEnumerableProperty = descriptors ? function(object, key2, value) {
      return objectDefineProperty.f(object, key2, createPropertyDescriptor(1, value));
    } : function(object, key2, value) {
      object[key2] = value;
      return object;
    };
    var functionToString = functionUncurryThis(Function.toString);
    if (!isCallable(sharedStore.inspectSource)) {
      sharedStore.inspectSource = function(it) {
        return functionToString(it);
      };
    }
    var inspectSource = sharedStore.inspectSource;
    var WeakMap$1 = global_1.WeakMap;
    var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));
    var keys = shared("keys");
    var sharedKey = function(key2) {
      return keys[key2] || (keys[key2] = uid(key2));
    };
    var hiddenKeys$1 = {};
    var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
    var TypeError$a = global_1.TypeError;
    var WeakMap2 = global_1.WeakMap;
    var set;
    var get;
    var has;
    var enforce = function(it) {
      return has(it) ? get(it) : set(it, {});
    };
    var getterFor = function(TYPE) {
      return function(it) {
        var state;
        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw TypeError$a("Incompatible receiver, " + TYPE + " required");
        }
        return state;
      };
    };
    if (nativeWeakMap || sharedStore.state) {
      store = sharedStore.state || (sharedStore.state = new WeakMap2());
      wmget = functionUncurryThis(store.get);
      wmhas = functionUncurryThis(store.has);
      wmset = functionUncurryThis(store.set);
      set = function(it, metadata) {
        if (wmhas(store, it))
          throw new TypeError$a(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        wmset(store, it, metadata);
        return metadata;
      };
      get = function(it) {
        return wmget(store, it) || {};
      };
      has = function(it) {
        return wmhas(store, it);
      };
    } else {
      STATE = sharedKey("state");
      hiddenKeys$1[STATE] = true;
      set = function(it, metadata) {
        if (hasOwnProperty_1(it, STATE))
          throw new TypeError$a(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        createNonEnumerableProperty(it, STATE, metadata);
        return metadata;
      };
      get = function(it) {
        return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
      };
      has = function(it) {
        return hasOwnProperty_1(it, STATE);
      };
    }
    var store;
    var wmget;
    var wmhas;
    var wmset;
    var STATE;
    var internalState = {
      set,
      get,
      has,
      enforce,
      getterFor
    };
    var FunctionPrototype$1 = Function.prototype;
    var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;
    var EXISTS = hasOwnProperty_1(FunctionPrototype$1, "name");
    var PROPER = EXISTS && function something() {
    }.name === "something";
    var CONFIGURABLE = EXISTS && (!descriptors || descriptors && getDescriptor(FunctionPrototype$1, "name").configurable);
    var functionName = {
      EXISTS,
      PROPER,
      CONFIGURABLE
    };
    var redefine = createCommonjsModule(function(module3) {
      var CONFIGURABLE_FUNCTION_NAME2 = functionName.CONFIGURABLE;
      var getInternalState2 = internalState.get;
      var enforceInternalState = internalState.enforce;
      var TEMPLATE = String(String).split("String");
      (module3.exports = function(O, key2, value, options) {
        var unsafe = options ? !!options.unsafe : false;
        var simple = options ? !!options.enumerable : false;
        var noTargetGet = options ? !!options.noTargetGet : false;
        var name = options && options.name !== void 0 ? options.name : key2;
        var state;
        if (isCallable(value)) {
          if (String(name).slice(0, 7) === "Symbol(") {
            name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
          }
          if (!hasOwnProperty_1(value, "name") || CONFIGURABLE_FUNCTION_NAME2 && value.name !== name) {
            createNonEnumerableProperty(value, "name", name);
          }
          state = enforceInternalState(value);
          if (!state.source) {
            state.source = TEMPLATE.join(typeof name == "string" ? name : "");
          }
        }
        if (O === global_1) {
          if (simple)
            O[key2] = value;
          else
            setGlobal(key2, value);
          return;
        } else if (!unsafe) {
          delete O[key2];
        } else if (!noTargetGet && O[key2]) {
          simple = true;
        }
        if (simple)
          O[key2] = value;
        else
          createNonEnumerableProperty(O, key2, value);
      })(Function.prototype, "toString", function toString2() {
        return isCallable(this) && getInternalState2(this).source || inspectSource(this);
      });
    });
    var ceil = Math.ceil;
    var floor = Math.floor;
    var toIntegerOrInfinity = function(argument) {
      var number = +argument;
      return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
    };
    var max$1 = Math.max;
    var min$2 = Math.min;
    var toAbsoluteIndex = function(index, length) {
      var integer = toIntegerOrInfinity(index);
      return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
    };
    var min$1 = Math.min;
    var toLength = function(argument) {
      return argument > 0 ? min$1(toIntegerOrInfinity(argument), 9007199254740991) : 0;
    };
    var lengthOfArrayLike = function(obj) {
      return toLength(obj.length);
    };
    var createMethod$2 = function(IS_INCLUDES) {
      return function($this, el, fromIndex) {
        var O = toIndexedObject($this);
        var length = lengthOfArrayLike(O);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        if (IS_INCLUDES && el != el)
          while (length > index) {
            value = O[index++];
            if (value != value)
              return true;
          }
        else
          for (; length > index; index++) {
            if ((IS_INCLUDES || index in O) && O[index] === el)
              return IS_INCLUDES || index || 0;
          }
        return !IS_INCLUDES && -1;
      };
    };
    var arrayIncludes = {
      includes: createMethod$2(true),
      indexOf: createMethod$2(false)
    };
    var indexOf = arrayIncludes.indexOf;
    var push$2 = functionUncurryThis([].push);
    var objectKeysInternal = function(object, names) {
      var O = toIndexedObject(object);
      var i2 = 0;
      var result = [];
      var key2;
      for (key2 in O)
        !hasOwnProperty_1(hiddenKeys$1, key2) && hasOwnProperty_1(O, key2) && push$2(result, key2);
      while (names.length > i2)
        if (hasOwnProperty_1(O, key2 = names[i2++])) {
          ~indexOf(result, key2) || push$2(result, key2);
        }
      return result;
    };
    var enumBugKeys = [
      "constructor",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toLocaleString",
      "toString",
      "valueOf"
    ];
    var hiddenKeys = enumBugKeys.concat("length", "prototype");
    var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys);
    };
    var objectGetOwnPropertyNames = {
      f: f$4
    };
    var f$3 = Object.getOwnPropertySymbols;
    var objectGetOwnPropertySymbols = {
      f: f$3
    };
    var concat = functionUncurryThis([].concat);
    var ownKeys = getBuiltIn("Reflect", "ownKeys") || function ownKeys2(it) {
      var keys2 = objectGetOwnPropertyNames.f(anObject(it));
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols ? concat(keys2, getOwnPropertySymbols(it)) : keys2;
    };
    var copyConstructorProperties = function(target, source, exceptions) {
      var keys2 = ownKeys(source);
      var defineProperty2 = objectDefineProperty.f;
      var getOwnPropertyDescriptor2 = objectGetOwnPropertyDescriptor.f;
      for (var i2 = 0; i2 < keys2.length; i2++) {
        var key2 = keys2[i2];
        if (!hasOwnProperty_1(target, key2) && !(exceptions && hasOwnProperty_1(exceptions, key2))) {
          defineProperty2(target, key2, getOwnPropertyDescriptor2(source, key2));
        }
      }
    };
    var replacement = /#|\.prototype\./;
    var isForced = function(feature, detection) {
      var value = data[normalize2(feature)];
      return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
    };
    var normalize2 = isForced.normalize = function(string) {
      return String(string).replace(replacement, ".").toLowerCase();
    };
    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = "N";
    var POLYFILL = isForced.POLYFILL = "P";
    var isForced_1 = isForced;
    var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
    var _export = function(options, source) {
      var TARGET = options.target;
      var GLOBAL = options.global;
      var STATIC = options.stat;
      var FORCED2, target, key2, targetProperty, sourceProperty, descriptor;
      if (GLOBAL) {
        target = global_1;
      } else if (STATIC) {
        target = global_1[TARGET] || setGlobal(TARGET, {});
      } else {
        target = (global_1[TARGET] || {}).prototype;
      }
      if (target)
        for (key2 in source) {
          sourceProperty = source[key2];
          if (options.noTargetGet) {
            descriptor = getOwnPropertyDescriptor$1(target, key2);
            targetProperty = descriptor && descriptor.value;
          } else
            targetProperty = target[key2];
          FORCED2 = isForced_1(GLOBAL ? key2 : TARGET + (STATIC ? "." : "#") + key2, options.forced);
          if (!FORCED2 && targetProperty !== void 0) {
            if (typeof sourceProperty == typeof targetProperty)
              continue;
            copyConstructorProperties(sourceProperty, targetProperty);
          }
          if (options.sham || targetProperty && targetProperty.sham) {
            createNonEnumerableProperty(sourceProperty, "sham", true);
          }
          redefine(target, key2, sourceProperty, options);
        }
    };
    var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag");
    var test = {};
    test[TO_STRING_TAG$3] = "z";
    var toStringTagSupport = String(test) === "[object z]";
    var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag");
    var Object$2 = global_1.Object;
    var CORRECT_ARGUMENTS = classofRaw(function() {
      return arguments;
    }()) == "Arguments";
    var tryGet = function(it, key2) {
      try {
        return it[key2];
      } catch (error2) {
      }
    };
    var classof = toStringTagSupport ? classofRaw : function(it) {
      var O, tag, result;
      return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && isCallable(O.callee) ? "Arguments" : result;
    };
    var String$2 = global_1.String;
    var toString_1 = function(argument) {
      if (classof(argument) === "Symbol")
        throw TypeError("Cannot convert a Symbol value to a string");
      return String$2(argument);
    };
    var MATCH$1 = wellKnownSymbol("match");
    var isRegexp = function(it) {
      var isRegExp;
      return isObject(it) && ((isRegExp = it[MATCH$1]) !== void 0 ? !!isRegExp : classofRaw(it) == "RegExp");
    };
    var TypeError$9 = global_1.TypeError;
    var notARegexp = function(it) {
      if (isRegexp(it)) {
        throw TypeError$9("The method doesn't accept regular expressions");
      }
      return it;
    };
    var MATCH = wellKnownSymbol("match");
    var correctIsRegexpLogic = function(METHOD_NAME) {
      var regexp2 = /./;
      try {
        "/./"[METHOD_NAME](regexp2);
      } catch (error1) {
        try {
          regexp2[MATCH] = false;
          return "/./"[METHOD_NAME](regexp2);
        } catch (error2) {
        }
      }
      return false;
    };
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var un$StartsWith = functionUncurryThis("".startsWith);
    var stringSlice$2 = functionUncurryThis("".slice);
    var min = Math.min;
    var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic("startsWith");
    var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function() {
      var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
      return descriptor && !descriptor.writable;
    }();
    _export({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
      startsWith: function startsWith(searchString) {
        var that = toString_1(requireObjectCoercible(this));
        notARegexp(searchString);
        var index = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
        var search = toString_1(searchString);
        return un$StartsWith ? un$StartsWith(that, search, index) : stringSlice$2(that, index, index + search.length) === search;
      }
    });
    var entryUnbind = function(CONSTRUCTOR, METHOD) {
      return functionUncurryThis(global_1[CONSTRUCTOR].prototype[METHOD]);
    };
    entryUnbind("String", "startsWith");
    var isArray$1 = Array.isArray || function isArray2(argument) {
      return classofRaw(argument) == "Array";
    };
    var createProperty = function(object, key2, value) {
      var propertyKey = toPropertyKey(key2);
      if (propertyKey in object)
        objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
      else
        object[propertyKey] = value;
    };
    var noop$1 = function() {
    };
    var empty = [];
    var construct = getBuiltIn("Reflect", "construct");
    var constructorRegExp = /^\s*(?:class|function)\b/;
    var exec = functionUncurryThis(constructorRegExp.exec);
    var INCORRECT_TO_STRING = !constructorRegExp.exec(noop$1);
    var isConstructorModern = function isConstructor2(argument) {
      if (!isCallable(argument))
        return false;
      try {
        construct(noop$1, empty, argument);
        return true;
      } catch (error2) {
        return false;
      }
    };
    var isConstructorLegacy = function isConstructor2(argument) {
      if (!isCallable(argument))
        return false;
      switch (classof(argument)) {
        case "AsyncFunction":
        case "GeneratorFunction":
        case "AsyncGeneratorFunction":
          return false;
      }
      try {
        return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
      } catch (error2) {
        return true;
      }
    };
    isConstructorLegacy.sham = true;
    var isConstructor = !construct || fails(function() {
      var called2;
      return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
        called2 = true;
      }) || called2;
    }) ? isConstructorLegacy : isConstructorModern;
    var SPECIES$3 = wellKnownSymbol("species");
    var Array$3 = global_1.Array;
    var arraySpeciesConstructor = function(originalArray) {
      var C;
      if (isArray$1(originalArray)) {
        C = originalArray.constructor;
        if (isConstructor(C) && (C === Array$3 || isArray$1(C.prototype)))
          C = void 0;
        else if (isObject(C)) {
          C = C[SPECIES$3];
          if (C === null)
            C = void 0;
        }
      }
      return C === void 0 ? Array$3 : C;
    };
    var arraySpeciesCreate = function(originalArray, length) {
      return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
    };
    var SPECIES$2 = wellKnownSymbol("species");
    var arrayMethodHasSpeciesSupport = function(METHOD_NAME) {
      return engineV8Version >= 51 || !fails(function() {
        var array = [];
        var constructor = array.constructor = {};
        constructor[SPECIES$2] = function() {
          return { foo: 1 };
        };
        return array[METHOD_NAME](Boolean).foo !== 1;
      });
    };
    var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded";
    var TypeError$8 = global_1.TypeError;
    var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function() {
      var array = [];
      array[IS_CONCAT_SPREADABLE] = false;
      return array.concat()[0] !== array;
    });
    var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");
    var isConcatSpreadable = function(O) {
      if (!isObject(O))
        return false;
      var spreadable = O[IS_CONCAT_SPREADABLE];
      return spreadable !== void 0 ? !!spreadable : isArray$1(O);
    };
    var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
    _export({ target: "Array", proto: true, forced: FORCED$1 }, {
      concat: function concat2(arg) {
        var O = toObject(this);
        var A2 = arraySpeciesCreate(O, 0);
        var n = 0;
        var i2, k, length, len, E;
        for (i2 = -1, length = arguments.length; i2 < length; i2++) {
          E = i2 === -1 ? O : arguments[i2];
          if (isConcatSpreadable(E)) {
            len = lengthOfArrayLike(E);
            if (n + len > MAX_SAFE_INTEGER)
              throw TypeError$8(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
            for (k = 0; k < len; k++, n++)
              if (k in E)
                createProperty(A2, n, E[k]);
          } else {
            if (n >= MAX_SAFE_INTEGER)
              throw TypeError$8(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
            createProperty(A2, n++, E);
          }
        }
        A2.length = n;
        return A2;
      }
    });
    var objectToString = toStringTagSupport ? {}.toString : function toString2() {
      return "[object " + classof(this) + "]";
    };
    if (!toStringTagSupport) {
      redefine(Object.prototype, "toString", objectToString, { unsafe: true });
    }
    var FunctionPrototype = Function.prototype;
    var apply = FunctionPrototype.apply;
    var call = FunctionPrototype.call;
    var functionApply = typeof Reflect == "object" && Reflect.apply || (functionBindNative ? call.bind(apply) : function() {
      return call.apply(apply, arguments);
    });
    var objectKeys = Object.keys || function keys2(O) {
      return objectKeysInternal(O, enumBugKeys);
    };
    var f$2 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject(O);
      var props = toIndexedObject(Properties);
      var keys2 = objectKeys(Properties);
      var length = keys2.length;
      var index = 0;
      var key2;
      while (length > index)
        objectDefineProperty.f(O, key2 = keys2[index++], props[key2]);
      return O;
    };
    var objectDefineProperties = {
      f: f$2
    };
    var html = getBuiltIn("document", "documentElement");
    var GT = ">";
    var LT = "<";
    var PROTOTYPE$1 = "prototype";
    var SCRIPT = "script";
    var IE_PROTO$1 = sharedKey("IE_PROTO");
    var EmptyConstructor = function() {
    };
    var scriptTag = function(content) {
      return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
    };
    var NullProtoObjectViaActiveX = function(activeXDocument2) {
      activeXDocument2.write(scriptTag(""));
      activeXDocument2.close();
      var temp = activeXDocument2.parentWindow.Object;
      activeXDocument2 = null;
      return temp;
    };
    var NullProtoObjectViaIFrame = function() {
      var iframe = documentCreateElement("iframe");
      var JS = "java" + SCRIPT + ":";
      var iframeDocument;
      iframe.style.display = "none";
      html.appendChild(iframe);
      iframe.src = String(JS);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(scriptTag("document.F=Object"));
      iframeDocument.close();
      return iframeDocument.F;
    };
    var activeXDocument;
    var NullProtoObject = function() {
      try {
        activeXDocument = new ActiveXObject("htmlfile");
      } catch (error2) {
      }
      NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
      var length = enumBugKeys.length;
      while (length--)
        delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
      return NullProtoObject();
    };
    hiddenKeys$1[IE_PROTO$1] = true;
    var objectCreate = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        EmptyConstructor[PROTOTYPE$1] = anObject(O);
        result = new EmptyConstructor();
        EmptyConstructor[PROTOTYPE$1] = null;
        result[IE_PROTO$1] = O;
      } else
        result = NullProtoObject();
      return Properties === void 0 ? result : objectDefineProperties.f(result, Properties);
    };
    var Array$2 = global_1.Array;
    var max = Math.max;
    var arraySliceSimple = function(O, start, end) {
      var length = lengthOfArrayLike(O);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
      var result = Array$2(max(fin - k, 0));
      for (var n = 0; k < fin; k++, n++)
        createProperty(result, n, O[k]);
      result.length = n;
      return result;
    };
    var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
    var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
    var getWindowNames = function(it) {
      try {
        return $getOwnPropertyNames$1(it);
      } catch (error2) {
        return arraySliceSimple(windowNames);
      }
    };
    var f$1 = function getOwnPropertyNames(it) {
      return windowNames && classofRaw(it) == "Window" ? getWindowNames(it) : $getOwnPropertyNames$1(toIndexedObject(it));
    };
    var objectGetOwnPropertyNamesExternal = {
      f: f$1
    };
    var arraySlice = functionUncurryThis([].slice);
    var f3 = wellKnownSymbol;
    var wellKnownSymbolWrapped = {
      f: f3
    };
    var path = global_1;
    var defineProperty$5 = objectDefineProperty.f;
    var defineWellKnownSymbol = function(NAME3) {
      var Symbol2 = path.Symbol || (path.Symbol = {});
      if (!hasOwnProperty_1(Symbol2, NAME3))
        defineProperty$5(Symbol2, NAME3, {
          value: wellKnownSymbolWrapped.f(NAME3)
        });
    };
    var defineProperty$4 = objectDefineProperty.f;
    var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag");
    var setToStringTag = function(target, TAG, STATIC) {
      if (target && !STATIC)
        target = target.prototype;
      if (target && !hasOwnProperty_1(target, TO_STRING_TAG$1)) {
        defineProperty$4(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
      }
    };
    var bind$1 = functionUncurryThis(functionUncurryThis.bind);
    var functionBindContext = function(fn, that) {
      aCallable(fn);
      return that === void 0 ? fn : functionBindNative ? bind$1(fn, that) : function() {
        return fn.apply(that, arguments);
      };
    };
    var push$1 = functionUncurryThis([].push);
    var createMethod$1 = function(TYPE) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var IS_FILTER_REJECT = TYPE == 7;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      return function($this, callbackfn, that, specificCreate) {
        var O = toObject($this);
        var self2 = indexedObject(O);
        var boundFunction = functionBindContext(callbackfn, that);
        var length = lengthOfArrayLike(self2);
        var index = 0;
        var create = specificCreate || arraySpeciesCreate;
        var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : void 0;
        var value, result;
        for (; length > index; index++)
          if (NO_HOLES || index in self2) {
            value = self2[index];
            result = boundFunction(value, index, O);
            if (TYPE) {
              if (IS_MAP)
                target[index] = result;
              else if (result)
                switch (TYPE) {
                  case 3:
                    return true;
                  case 5:
                    return value;
                  case 6:
                    return index;
                  case 2:
                    push$1(target, value);
                }
              else
                switch (TYPE) {
                  case 4:
                    return false;
                  case 7:
                    push$1(target, value);
                }
            }
          }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
      };
    };
    var arrayIteration = {
      forEach: createMethod$1(0),
      map: createMethod$1(1),
      filter: createMethod$1(2),
      some: createMethod$1(3),
      every: createMethod$1(4),
      find: createMethod$1(5),
      findIndex: createMethod$1(6),
      filterReject: createMethod$1(7)
    };
    var $forEach = arrayIteration.forEach;
    var HIDDEN = sharedKey("hidden");
    var SYMBOL = "Symbol";
    var PROTOTYPE = "prototype";
    var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
    var setInternalState$3 = internalState.set;
    var getInternalState$2 = internalState.getterFor(SYMBOL);
    var ObjectPrototype$2 = Object[PROTOTYPE];
    var $Symbol = global_1.Symbol;
    var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
    var TypeError$7 = global_1.TypeError;
    var QObject = global_1.QObject;
    var $stringify = getBuiltIn("JSON", "stringify");
    var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var nativeDefineProperty = objectDefineProperty.f;
    var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
    var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
    var push = functionUncurryThis([].push);
    var AllSymbols = shared("symbols");
    var ObjectPrototypeSymbols = shared("op-symbols");
    var StringToSymbolRegistry = shared("string-to-symbol-registry");
    var SymbolToStringRegistry = shared("symbol-to-string-registry");
    var WellKnownSymbolsStore = shared("wks");
    var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
    var setSymbolDescriptor = descriptors && fails(function() {
      return objectCreate(nativeDefineProperty({}, "a", {
        get: function() {
          return nativeDefineProperty(this, "a", { value: 7 }).a;
        }
      })).a != 7;
    }) ? function(O, P, Attributes) {
      var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$2, P);
      if (ObjectPrototypeDescriptor)
        delete ObjectPrototype$2[P];
      nativeDefineProperty(O, P, Attributes);
      if (ObjectPrototypeDescriptor && O !== ObjectPrototype$2) {
        nativeDefineProperty(ObjectPrototype$2, P, ObjectPrototypeDescriptor);
      }
    } : nativeDefineProperty;
    var wrap = function(tag, description) {
      var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype$1);
      setInternalState$3(symbol, {
        type: SYMBOL,
        tag,
        description
      });
      if (!descriptors)
        symbol.description = description;
      return symbol;
    };
    var $defineProperty = function defineProperty2(O, P, Attributes) {
      if (O === ObjectPrototype$2)
        $defineProperty(ObjectPrototypeSymbols, P, Attributes);
      anObject(O);
      var key2 = toPropertyKey(P);
      anObject(Attributes);
      if (hasOwnProperty_1(AllSymbols, key2)) {
        if (!Attributes.enumerable) {
          if (!hasOwnProperty_1(O, HIDDEN))
            nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
          O[HIDDEN][key2] = true;
        } else {
          if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key2])
            O[HIDDEN][key2] = false;
          Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
        }
        return setSymbolDescriptor(O, key2, Attributes);
      }
      return nativeDefineProperty(O, key2, Attributes);
    };
    var $defineProperties = function defineProperties(O, Properties) {
      anObject(O);
      var properties = toIndexedObject(Properties);
      var keys2 = objectKeys(properties).concat($getOwnPropertySymbols(properties));
      $forEach(keys2, function(key2) {
        if (!descriptors || functionCall($propertyIsEnumerable, properties, key2))
          $defineProperty(O, key2, properties[key2]);
      });
      return O;
    };
    var $create = function create(O, Properties) {
      return Properties === void 0 ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(V) {
      var P = toPropertyKey(V);
      var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
      if (this === ObjectPrototype$2 && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P))
        return false;
      return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor2(O, P) {
      var it = toIndexedObject(O);
      var key2 = toPropertyKey(P);
      if (it === ObjectPrototype$2 && hasOwnProperty_1(AllSymbols, key2) && !hasOwnProperty_1(ObjectPrototypeSymbols, key2))
        return;
      var descriptor = nativeGetOwnPropertyDescriptor(it, key2);
      if (descriptor && hasOwnProperty_1(AllSymbols, key2) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key2])) {
        descriptor.enumerable = true;
      }
      return descriptor;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(O) {
      var names = nativeGetOwnPropertyNames(toIndexedObject(O));
      var result = [];
      $forEach(names, function(key2) {
        if (!hasOwnProperty_1(AllSymbols, key2) && !hasOwnProperty_1(hiddenKeys$1, key2))
          push(result, key2);
      });
      return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
      var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$2;
      var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
      var result = [];
      $forEach(names, function(key2) {
        if (hasOwnProperty_1(AllSymbols, key2) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$2, key2))) {
          push(result, AllSymbols[key2]);
        }
      });
      return result;
    };
    if (!nativeSymbol) {
      $Symbol = function Symbol2() {
        if (objectIsPrototypeOf(SymbolPrototype$1, this))
          throw TypeError$7("Symbol is not a constructor");
        var description = !arguments.length || arguments[0] === void 0 ? void 0 : toString_1(arguments[0]);
        var tag = uid(description);
        var setter = function(value) {
          if (this === ObjectPrototype$2)
            functionCall(setter, ObjectPrototypeSymbols, value);
          if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag))
            this[HIDDEN][tag] = false;
          setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
        };
        if (descriptors && USE_SETTER)
          setSymbolDescriptor(ObjectPrototype$2, tag, { configurable: true, set: setter });
        return wrap(tag, description);
      };
      SymbolPrototype$1 = $Symbol[PROTOTYPE];
      redefine(SymbolPrototype$1, "toString", function toString2() {
        return getInternalState$2(this).tag;
      });
      redefine($Symbol, "withoutSetter", function(description) {
        return wrap(uid(description), description);
      });
      objectPropertyIsEnumerable.f = $propertyIsEnumerable;
      objectDefineProperty.f = $defineProperty;
      objectDefineProperties.f = $defineProperties;
      objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
      objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
      objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;
      wellKnownSymbolWrapped.f = function(name) {
        return wrap(wellKnownSymbol(name), name);
      };
      if (descriptors) {
        nativeDefineProperty(SymbolPrototype$1, "description", {
          configurable: true,
          get: function description() {
            return getInternalState$2(this).description;
          }
        });
        {
          redefine(ObjectPrototype$2, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
        }
      }
    }
    _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
      Symbol: $Symbol
    });
    $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
      defineWellKnownSymbol(name);
    });
    _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
      "for": function(key2) {
        var string = toString_1(key2);
        if (hasOwnProperty_1(StringToSymbolRegistry, string))
          return StringToSymbolRegistry[string];
        var symbol = $Symbol(string);
        StringToSymbolRegistry[string] = symbol;
        SymbolToStringRegistry[symbol] = string;
        return symbol;
      },
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym))
          throw TypeError$7(sym + " is not a symbol");
        if (hasOwnProperty_1(SymbolToStringRegistry, sym))
          return SymbolToStringRegistry[sym];
      },
      useSetter: function() {
        USE_SETTER = true;
      },
      useSimple: function() {
        USE_SETTER = false;
      }
    });
    _export({ target: "Object", stat: true, forced: !nativeSymbol, sham: !descriptors }, {
      create: $create,
      defineProperty: $defineProperty,
      defineProperties: $defineProperties,
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor
    });
    _export({ target: "Object", stat: true, forced: !nativeSymbol }, {
      getOwnPropertyNames: $getOwnPropertyNames,
      getOwnPropertySymbols: $getOwnPropertySymbols
    });
    _export({ target: "Object", stat: true, forced: fails(function() {
      objectGetOwnPropertySymbols.f(1);
    }) }, {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        return objectGetOwnPropertySymbols.f(toObject(it));
      }
    });
    if ($stringify) {
      FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function() {
        var symbol = $Symbol();
        return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
      });
      _export({ target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY }, {
        stringify: function stringify(it, replacer, space) {
          var args = arraySlice(arguments);
          var $replacer = replacer;
          if (!isObject(replacer) && it === void 0 || isSymbol(it))
            return;
          if (!isArray$1(replacer))
            replacer = function(key2, value) {
              if (isCallable($replacer))
                value = functionCall($replacer, this, key2, value);
              if (!isSymbol(value))
                return value;
            };
          args[1] = replacer;
          return functionApply($stringify, null, args);
        }
      });
    }
    var FORCED_JSON_STRINGIFY;
    if (!SymbolPrototype$1[TO_PRIMITIVE]) {
      valueOf = SymbolPrototype$1.valueOf;
      redefine(SymbolPrototype$1, TO_PRIMITIVE, function(hint) {
        return functionCall(valueOf, this);
      });
    }
    var valueOf;
    setToStringTag($Symbol, SYMBOL);
    hiddenKeys$1[HIDDEN] = true;
    defineWellKnownSymbol("asyncIterator");
    var defineProperty$3 = objectDefineProperty.f;
    var NativeSymbol = global_1.Symbol;
    var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;
    if (descriptors && isCallable(NativeSymbol) && (!("description" in SymbolPrototype) || NativeSymbol().description !== void 0)) {
      EmptyStringDescriptionStore = {};
      SymbolWrapper = function Symbol2() {
        var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : toString_1(arguments[0]);
        var result = objectIsPrototypeOf(SymbolPrototype, this) ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
        if (description === "")
          EmptyStringDescriptionStore[result] = true;
        return result;
      };
      copyConstructorProperties(SymbolWrapper, NativeSymbol);
      SymbolWrapper.prototype = SymbolPrototype;
      SymbolPrototype.constructor = SymbolWrapper;
      NATIVE_SYMBOL = String(NativeSymbol("test")) == "Symbol(test)";
      symbolToString = functionUncurryThis(SymbolPrototype.toString);
      symbolValueOf = functionUncurryThis(SymbolPrototype.valueOf);
      regexp = /^Symbol\((.*)\)[^)]+$/;
      replace = functionUncurryThis("".replace);
      stringSlice$1 = functionUncurryThis("".slice);
      defineProperty$3(SymbolPrototype, "description", {
        configurable: true,
        get: function description() {
          var symbol = symbolValueOf(this);
          var string = symbolToString(symbol);
          if (hasOwnProperty_1(EmptyStringDescriptionStore, symbol))
            return "";
          var desc = NATIVE_SYMBOL ? stringSlice$1(string, 7, -1) : replace(string, regexp, "$1");
          return desc === "" ? void 0 : desc;
        }
      });
      _export({ global: true, forced: true }, {
        Symbol: SymbolWrapper
      });
    }
    var EmptyStringDescriptionStore;
    var SymbolWrapper;
    var NATIVE_SYMBOL;
    var symbolToString;
    var symbolValueOf;
    var regexp;
    var replace;
    var stringSlice$1;
    defineWellKnownSymbol("hasInstance");
    defineWellKnownSymbol("isConcatSpreadable");
    defineWellKnownSymbol("iterator");
    defineWellKnownSymbol("match");
    defineWellKnownSymbol("matchAll");
    defineWellKnownSymbol("replace");
    defineWellKnownSymbol("search");
    defineWellKnownSymbol("species");
    defineWellKnownSymbol("split");
    defineWellKnownSymbol("toPrimitive");
    defineWellKnownSymbol("toStringTag");
    defineWellKnownSymbol("unscopables");
    setToStringTag(global_1.JSON, "JSON", true);
    setToStringTag(Math, "Math", true);
    _export({ global: true }, { Reflect: {} });
    setToStringTag(global_1.Reflect, "Reflect", true);
    path.Symbol;
    var charAt$1 = functionUncurryThis("".charAt);
    var charCodeAt = functionUncurryThis("".charCodeAt);
    var stringSlice = functionUncurryThis("".slice);
    var createMethod = function(CONVERT_TO_STRING) {
      return function($this, pos) {
        var S2 = toString_1(requireObjectCoercible($this));
        var position = toIntegerOrInfinity(pos);
        var size = S2.length;
        var first, second;
        if (position < 0 || position >= size)
          return CONVERT_TO_STRING ? "" : void 0;
        first = charCodeAt(S2, position);
        return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S2, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt$1(S2, position) : first : CONVERT_TO_STRING ? stringSlice(S2, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
      };
    };
    var stringMultibyte = {
      codeAt: createMethod(false),
      charAt: createMethod(true)
    };
    var correctPrototypeGetter = !fails(function() {
      function F2() {
      }
      F2.prototype.constructor = null;
      return Object.getPrototypeOf(new F2()) !== F2.prototype;
    });
    var IE_PROTO = sharedKey("IE_PROTO");
    var Object$1 = global_1.Object;
    var ObjectPrototype$1 = Object$1.prototype;
    var objectGetPrototypeOf = correctPrototypeGetter ? Object$1.getPrototypeOf : function(O) {
      var object = toObject(O);
      if (hasOwnProperty_1(object, IE_PROTO))
        return object[IE_PROTO];
      var constructor = object.constructor;
      if (isCallable(constructor) && object instanceof constructor) {
        return constructor.prototype;
      }
      return object instanceof Object$1 ? ObjectPrototype$1 : null;
    };
    var ITERATOR$4 = wellKnownSymbol("iterator");
    var BUGGY_SAFARI_ITERATORS$1 = false;
    var IteratorPrototype$2;
    var PrototypeOfArrayIteratorPrototype;
    var arrayIterator;
    if ([].keys) {
      arrayIterator = [].keys();
      if (!("next" in arrayIterator))
        BUGGY_SAFARI_ITERATORS$1 = true;
      else {
        PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
          IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
      }
    }
    var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == void 0 || fails(function() {
      var test2 = {};
      return IteratorPrototype$2[ITERATOR$4].call(test2) !== test2;
    });
    if (NEW_ITERATOR_PROTOTYPE)
      IteratorPrototype$2 = {};
    if (!isCallable(IteratorPrototype$2[ITERATOR$4])) {
      redefine(IteratorPrototype$2, ITERATOR$4, function() {
        return this;
      });
    }
    var iteratorsCore = {
      IteratorPrototype: IteratorPrototype$2,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
    };
    var iterators = {};
    var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
    var returnThis$1 = function() {
      return this;
    };
    var createIteratorConstructor = function(IteratorConstructor, NAME3, next, ENUMERABLE_NEXT) {
      var TO_STRING_TAG2 = NAME3 + " Iterator";
      IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
      setToStringTag(IteratorConstructor, TO_STRING_TAG2, false);
      iterators[TO_STRING_TAG2] = returnThis$1;
      return IteratorConstructor;
    };
    var String$1 = global_1.String;
    var TypeError$6 = global_1.TypeError;
    var aPossiblePrototype = function(argument) {
      if (typeof argument == "object" || isCallable(argument))
        return argument;
      throw TypeError$6("Can't set " + String$1(argument) + " as a prototype");
    };
    var objectSetPrototypeOf = Object.setPrototypeOf || ("__proto__" in {} ? function() {
      var CORRECT_SETTER = false;
      var test2 = {};
      var setter;
      try {
        setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set);
        setter(test2, []);
        CORRECT_SETTER = test2 instanceof Array;
      } catch (error2) {
      }
      return function setPrototypeOf(O, proto) {
        anObject(O);
        aPossiblePrototype(proto);
        if (CORRECT_SETTER)
          setter(O, proto);
        else
          O.__proto__ = proto;
        return O;
      };
    }() : void 0);
    var PROPER_FUNCTION_NAME = functionName.PROPER;
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
    var IteratorPrototype = iteratorsCore.IteratorPrototype;
    var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
    var ITERATOR$3 = wellKnownSymbol("iterator");
    var KEYS = "keys";
    var VALUES = "values";
    var ENTRIES = "entries";
    var returnThis = function() {
      return this;
    };
    var defineIterator = function(Iterable, NAME3, IteratorConstructor, next, DEFAULT, IS_SET, FORCED2) {
      createIteratorConstructor(IteratorConstructor, NAME3, next);
      var getIterationMethod = function(KIND) {
        if (KIND === DEFAULT && defaultIterator)
          return defaultIterator;
        if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
          return IterablePrototype[KIND];
        switch (KIND) {
          case KEYS:
            return function keys2() {
              return new IteratorConstructor(this, KIND);
            };
          case VALUES:
            return function values2() {
              return new IteratorConstructor(this, KIND);
            };
          case ENTRIES:
            return function entries() {
              return new IteratorConstructor(this, KIND);
            };
        }
        return function() {
          return new IteratorConstructor(this);
        };
      };
      var TO_STRING_TAG2 = NAME3 + " Iterator";
      var INCORRECT_VALUES_NAME = false;
      var IterablePrototype = Iterable.prototype;
      var nativeIterator = IterablePrototype[ITERATOR$3] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
      var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
      var anyNativeIterator = NAME3 == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
      var CurrentIteratorPrototype, methods, KEY;
      if (anyNativeIterator) {
        CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
        if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
          if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
            if (objectSetPrototypeOf) {
              objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
            } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$3])) {
              redefine(CurrentIteratorPrototype, ITERATOR$3, returnThis);
            }
          }
          setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG2, true);
        }
      }
      if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
        if (CONFIGURABLE_FUNCTION_NAME) {
          createNonEnumerableProperty(IterablePrototype, "name", VALUES);
        } else {
          INCORRECT_VALUES_NAME = true;
          defaultIterator = function values2() {
            return functionCall(nativeIterator, this);
          };
        }
      }
      if (DEFAULT) {
        methods = {
          values: getIterationMethod(VALUES),
          keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
          entries: getIterationMethod(ENTRIES)
        };
        if (FORCED2)
          for (KEY in methods) {
            if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
              redefine(IterablePrototype, KEY, methods[KEY]);
            }
          }
        else
          _export({ target: NAME3, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
      }
      if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
        redefine(IterablePrototype, ITERATOR$3, defaultIterator, { name: DEFAULT });
      }
      iterators[NAME3] = defaultIterator;
      return methods;
    };
    var charAt = stringMultibyte.charAt;
    var STRING_ITERATOR = "String Iterator";
    var setInternalState$2 = internalState.set;
    var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);
    defineIterator(String, "String", function(iterated) {
      setInternalState$2(this, {
        type: STRING_ITERATOR,
        string: toString_1(iterated),
        index: 0
      });
    }, function next() {
      var state = getInternalState$1(this);
      var string = state.string;
      var index = state.index;
      var point;
      if (index >= string.length)
        return { value: void 0, done: true };
      point = charAt(string, index);
      state.index += point.length;
      return { value: point, done: false };
    });
    var iteratorClose = function(iterator, kind, value) {
      var innerResult, innerError;
      anObject(iterator);
      try {
        innerResult = getMethod(iterator, "return");
        if (!innerResult) {
          if (kind === "throw")
            throw value;
          return value;
        }
        innerResult = functionCall(innerResult, iterator);
      } catch (error2) {
        innerError = true;
        innerResult = error2;
      }
      if (kind === "throw")
        throw value;
      if (innerError)
        throw innerResult;
      anObject(innerResult);
      return value;
    };
    var callWithSafeIterationClosing = function(iterator, fn, value, ENTRIES2) {
      try {
        return ENTRIES2 ? fn(anObject(value)[0], value[1]) : fn(value);
      } catch (error2) {
        iteratorClose(iterator, "throw", error2);
      }
    };
    var ITERATOR$2 = wellKnownSymbol("iterator");
    var ArrayPrototype$1 = Array.prototype;
    var isArrayIteratorMethod = function(it) {
      return it !== void 0 && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
    };
    var ITERATOR$1 = wellKnownSymbol("iterator");
    var getIteratorMethod = function(it) {
      if (it != void 0)
        return getMethod(it, ITERATOR$1) || getMethod(it, "@@iterator") || iterators[classof(it)];
    };
    var TypeError$5 = global_1.TypeError;
    var getIterator = function(argument, usingIterator) {
      var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
      if (aCallable(iteratorMethod))
        return anObject(functionCall(iteratorMethod, argument));
      throw TypeError$5(tryToString(argument) + " is not iterable");
    };
    var Array$1 = global_1.Array;
    var arrayFrom = function from(arrayLike) {
      var O = toObject(arrayLike);
      var IS_CONSTRUCTOR = isConstructor(this);
      var argumentsLength = arguments.length;
      var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
      var mapping = mapfn !== void 0;
      if (mapping)
        mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : void 0);
      var iteratorMethod = getIteratorMethod(O);
      var index = 0;
      var length, result, step, iterator, next, value;
      if (iteratorMethod && !(this == Array$1 && isArrayIteratorMethod(iteratorMethod))) {
        iterator = getIterator(O, iteratorMethod);
        next = iterator.next;
        result = IS_CONSTRUCTOR ? new this() : [];
        for (; !(step = functionCall(next, iterator)).done; index++) {
          value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
          createProperty(result, index, value);
        }
      } else {
        length = lengthOfArrayLike(O);
        result = IS_CONSTRUCTOR ? new this(length) : Array$1(length);
        for (; length > index; index++) {
          value = mapping ? mapfn(O[index], index) : O[index];
          createProperty(result, index, value);
        }
      }
      result.length = index;
      return result;
    };
    var ITERATOR = wellKnownSymbol("iterator");
    var SAFE_CLOSING = false;
    try {
      called = 0;
      iteratorWithReturn = {
        next: function() {
          return { done: !!called++ };
        },
        "return": function() {
          SAFE_CLOSING = true;
        }
      };
      iteratorWithReturn[ITERATOR] = function() {
        return this;
      };
      Array.from(iteratorWithReturn, function() {
        throw 2;
      });
    } catch (error2) {
    }
    var called;
    var iteratorWithReturn;
    var checkCorrectnessOfIteration = function(exec2, SKIP_CLOSING) {
      if (!SKIP_CLOSING && !SAFE_CLOSING)
        return false;
      var ITERATION_SUPPORT = false;
      try {
        var object = {};
        object[ITERATOR] = function() {
          return {
            next: function() {
              return { done: ITERATION_SUPPORT = true };
            }
          };
        };
        exec2(object);
      } catch (error2) {
      }
      return ITERATION_SUPPORT;
    };
    var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
      Array.from(iterable);
    });
    _export({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
      from: arrayFrom
    });
    path.Array.from;
    var arrayBufferNative = typeof ArrayBuffer != "undefined" && typeof DataView != "undefined";
    var defineProperty$2 = objectDefineProperty.f;
    var Int8Array$1 = global_1.Int8Array;
    var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
    var Uint8ClampedArray = global_1.Uint8ClampedArray;
    var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
    var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
    var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
    var ObjectPrototype = Object.prototype;
    var TypeError$4 = global_1.TypeError;
    var TO_STRING_TAG = wellKnownSymbol("toStringTag");
    var TYPED_ARRAY_TAG = uid("TYPED_ARRAY_TAG");
    var TYPED_ARRAY_CONSTRUCTOR$1 = uid("TYPED_ARRAY_CONSTRUCTOR");
    var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== "Opera";
    var TYPED_ARRAY_TAG_REQUIRED = false;
    var NAME2;
    var Constructor;
    var Prototype;
    var TypedArrayConstructorsList = {
      Int8Array: 1,
      Uint8Array: 1,
      Uint8ClampedArray: 1,
      Int16Array: 2,
      Uint16Array: 2,
      Int32Array: 4,
      Uint32Array: 4,
      Float32Array: 4,
      Float64Array: 8
    };
    var BigIntArrayConstructorsList = {
      BigInt64Array: 8,
      BigUint64Array: 8
    };
    var isView = function isView2(it) {
      if (!isObject(it))
        return false;
      var klass = classof(it);
      return klass === "DataView" || hasOwnProperty_1(TypedArrayConstructorsList, klass) || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
    };
    var isTypedArray = function(it) {
      if (!isObject(it))
        return false;
      var klass = classof(it);
      return hasOwnProperty_1(TypedArrayConstructorsList, klass) || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
    };
    var aTypedArray$1 = function(it) {
      if (isTypedArray(it))
        return it;
      throw TypeError$4("Target is not a typed array");
    };
    var aTypedArrayConstructor$1 = function(C) {
      if (isCallable(C) && (!objectSetPrototypeOf || objectIsPrototypeOf(TypedArray, C)))
        return C;
      throw TypeError$4(tryToString(C) + " is not a typed array constructor");
    };
    var exportTypedArrayMethod$1 = function(KEY, property, forced, options) {
      if (!descriptors)
        return;
      if (forced)
        for (var ARRAY in TypedArrayConstructorsList) {
          var TypedArrayConstructor = global_1[ARRAY];
          if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor.prototype, KEY))
            try {
              delete TypedArrayConstructor.prototype[KEY];
            } catch (error2) {
              try {
                TypedArrayConstructor.prototype[KEY] = property;
              } catch (error22) {
              }
            }
        }
      if (!TypedArrayPrototype[KEY] || forced) {
        redefine(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
      }
    };
    var exportTypedArrayStaticMethod = function(KEY, property, forced) {
      var ARRAY, TypedArrayConstructor;
      if (!descriptors)
        return;
      if (objectSetPrototypeOf) {
        if (forced)
          for (ARRAY in TypedArrayConstructorsList) {
            TypedArrayConstructor = global_1[ARRAY];
            if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor, KEY))
              try {
                delete TypedArrayConstructor[KEY];
              } catch (error2) {
              }
          }
        if (!TypedArray[KEY] || forced) {
          try {
            return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
          } catch (error2) {
          }
        } else
          return;
      }
      for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global_1[ARRAY];
        if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
          redefine(TypedArrayConstructor, KEY, property);
        }
      }
    };
    for (NAME2 in TypedArrayConstructorsList) {
      Constructor = global_1[NAME2];
      Prototype = Constructor && Constructor.prototype;
      if (Prototype)
        createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR$1, Constructor);
      else
        NATIVE_ARRAY_BUFFER_VIEWS = false;
    }
    for (NAME2 in BigIntArrayConstructorsList) {
      Constructor = global_1[NAME2];
      Prototype = Constructor && Constructor.prototype;
      if (Prototype)
        createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR$1, Constructor);
    }
    if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
      TypedArray = function TypedArray2() {
        throw TypeError$4("Incorrect invocation");
      };
      if (NATIVE_ARRAY_BUFFER_VIEWS)
        for (NAME2 in TypedArrayConstructorsList) {
          if (global_1[NAME2])
            objectSetPrototypeOf(global_1[NAME2], TypedArray);
        }
    }
    if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
      TypedArrayPrototype = TypedArray.prototype;
      if (NATIVE_ARRAY_BUFFER_VIEWS)
        for (NAME2 in TypedArrayConstructorsList) {
          if (global_1[NAME2])
            objectSetPrototypeOf(global_1[NAME2].prototype, TypedArrayPrototype);
        }
    }
    if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
      objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
    }
    if (descriptors && !hasOwnProperty_1(TypedArrayPrototype, TO_STRING_TAG)) {
      TYPED_ARRAY_TAG_REQUIRED = true;
      defineProperty$2(TypedArrayPrototype, TO_STRING_TAG, { get: function() {
        return isObject(this) ? this[TYPED_ARRAY_TAG] : void 0;
      } });
      for (NAME2 in TypedArrayConstructorsList)
        if (global_1[NAME2]) {
          createNonEnumerableProperty(global_1[NAME2], TYPED_ARRAY_TAG, NAME2);
        }
    }
    var arrayBufferViewCore = {
      NATIVE_ARRAY_BUFFER_VIEWS,
      TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR$1,
      TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
      aTypedArray: aTypedArray$1,
      aTypedArrayConstructor: aTypedArrayConstructor$1,
      exportTypedArrayMethod: exportTypedArrayMethod$1,
      exportTypedArrayStaticMethod,
      isView,
      isTypedArray,
      TypedArray,
      TypedArrayPrototype
    };
    var TypeError$3 = global_1.TypeError;
    var aConstructor = function(argument) {
      if (isConstructor(argument))
        return argument;
      throw TypeError$3(tryToString(argument) + " is not a constructor");
    };
    var SPECIES$1 = wellKnownSymbol("species");
    var speciesConstructor = function(O, defaultConstructor) {
      var C = anObject(O).constructor;
      var S2;
      return C === void 0 || (S2 = anObject(C)[SPECIES$1]) == void 0 ? defaultConstructor : aConstructor(S2);
    };
    var TYPED_ARRAY_CONSTRUCTOR = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
    var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
    var typedArraySpeciesConstructor = function(originalArray) {
      return aTypedArrayConstructor(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR]));
    };
    var aTypedArray = arrayBufferViewCore.aTypedArray;
    var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;
    var FORCED = fails(function() {
      new Int8Array(1).slice();
    });
    exportTypedArrayMethod("slice", function slice(start, end) {
      var list = arraySlice(aTypedArray(this), start, end);
      var C = typedArraySpeciesConstructor(this);
      var index = 0;
      var length = list.length;
      var result = new C(length);
      while (length > index)
        result[index] = list[index++];
      return result;
    }, FORCED);
    var UNSCOPABLES = wellKnownSymbol("unscopables");
    var ArrayPrototype = Array.prototype;
    if (ArrayPrototype[UNSCOPABLES] == void 0) {
      objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
        configurable: true,
        value: objectCreate(null)
      });
    }
    var addToUnscopables = function(key2) {
      ArrayPrototype[UNSCOPABLES][key2] = true;
    };
    var $includes = arrayIncludes.includes;
    _export({ target: "Array", proto: true }, {
      includes: function includes(el) {
        return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
      }
    });
    addToUnscopables("includes");
    entryUnbind("Array", "includes");
    var stringIndexOf = functionUncurryThis("".indexOf);
    _export({ target: "String", proto: true, forced: !correctIsRegexpLogic("includes") }, {
      includes: function includes(searchString) {
        return !!~stringIndexOf(toString_1(requireObjectCoercible(this)), toString_1(notARegexp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
      }
    });
    entryUnbind("String", "includes");
    var defineProperty$1 = objectDefineProperty.f;
    var ARRAY_ITERATOR = "Array Iterator";
    var setInternalState$1 = internalState.set;
    var getInternalState = internalState.getterFor(ARRAY_ITERATOR);
    defineIterator(Array, "Array", function(iterated, kind) {
      setInternalState$1(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated),
        index: 0,
        kind
      });
    }, function() {
      var state = getInternalState(this);
      var target = state.target;
      var kind = state.kind;
      var index = state.index++;
      if (!target || index >= target.length) {
        state.target = void 0;
        return { value: void 0, done: true };
      }
      if (kind == "keys")
        return { value: index, done: false };
      if (kind == "values")
        return { value: target[index], done: false };
      return { value: [index, target[index]], done: false };
    }, "values");
    var values = iterators.Arguments = iterators.Array;
    addToUnscopables("keys");
    addToUnscopables("values");
    addToUnscopables("entries");
    if (descriptors && values.name !== "values")
      try {
        defineProperty$1(values, "name", { value: "values" });
      } catch (error2) {
      }
    var arrayBufferNonExtensible = fails(function() {
      if (typeof ArrayBuffer == "function") {
        var buffer = new ArrayBuffer(8);
        if (Object.isExtensible(buffer))
          Object.defineProperty(buffer, "a", { value: 8 });
      }
    });
    var $isExtensible = Object.isExtensible;
    var FAILS_ON_PRIMITIVES = fails(function() {
      $isExtensible(1);
    });
    var objectIsExtensible = FAILS_ON_PRIMITIVES || arrayBufferNonExtensible ? function isExtensible(it) {
      if (!isObject(it))
        return false;
      if (arrayBufferNonExtensible && classofRaw(it) == "ArrayBuffer")
        return false;
      return $isExtensible ? $isExtensible(it) : true;
    } : $isExtensible;
    var freezing = !fails(function() {
      return Object.isExtensible(Object.preventExtensions({}));
    });
    var internalMetadata = createCommonjsModule(function(module3) {
      var defineProperty2 = objectDefineProperty.f;
      var REQUIRED = false;
      var METADATA = uid("meta");
      var id2 = 0;
      var setMetadata = function(it) {
        defineProperty2(it, METADATA, { value: {
          objectID: "O" + id2++,
          weakData: {}
        } });
      };
      var fastKey2 = function(it, create) {
        if (!isObject(it))
          return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
        if (!hasOwnProperty_1(it, METADATA)) {
          if (!objectIsExtensible(it))
            return "F";
          if (!create)
            return "E";
          setMetadata(it);
        }
        return it[METADATA].objectID;
      };
      var getWeakData = function(it, create) {
        if (!hasOwnProperty_1(it, METADATA)) {
          if (!objectIsExtensible(it))
            return true;
          if (!create)
            return false;
          setMetadata(it);
        }
        return it[METADATA].weakData;
      };
      var onFreeze = function(it) {
        if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA))
          setMetadata(it);
        return it;
      };
      var enable = function() {
        meta.enable = function() {
        };
        REQUIRED = true;
        var getOwnPropertyNames = objectGetOwnPropertyNames.f;
        var splice = functionUncurryThis([].splice);
        var test2 = {};
        test2[METADATA] = 1;
        if (getOwnPropertyNames(test2).length) {
          objectGetOwnPropertyNames.f = function(it) {
            var result = getOwnPropertyNames(it);
            for (var i2 = 0, length = result.length; i2 < length; i2++) {
              if (result[i2] === METADATA) {
                splice(result, i2, 1);
                break;
              }
            }
            return result;
          };
          _export({ target: "Object", stat: true, forced: true }, {
            getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
          });
        }
      };
      var meta = module3.exports = {
        enable,
        fastKey: fastKey2,
        getWeakData,
        onFreeze
      };
      hiddenKeys$1[METADATA] = true;
    });
    internalMetadata.enable;
    internalMetadata.fastKey;
    internalMetadata.getWeakData;
    internalMetadata.onFreeze;
    var TypeError$2 = global_1.TypeError;
    var Result = function(stopped, result) {
      this.stopped = stopped;
      this.result = result;
    };
    var ResultPrototype = Result.prototype;
    var iterate = function(iterable, unboundFunction, options) {
      var that = options && options.that;
      var AS_ENTRIES = !!(options && options.AS_ENTRIES);
      var IS_ITERATOR = !!(options && options.IS_ITERATOR);
      var INTERRUPTED = !!(options && options.INTERRUPTED);
      var fn = functionBindContext(unboundFunction, that);
      var iterator, iterFn, index, length, result, next, step;
      var stop = function(condition) {
        if (iterator)
          iteratorClose(iterator, "normal", condition);
        return new Result(true, condition);
      };
      var callFn = function(value) {
        if (AS_ENTRIES) {
          anObject(value);
          return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
        }
        return INTERRUPTED ? fn(value, stop) : fn(value);
      };
      if (IS_ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (!iterFn)
          throw TypeError$2(tryToString(iterable) + " is not iterable");
        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
            result = callFn(iterable[index]);
            if (result && objectIsPrototypeOf(ResultPrototype, result))
              return result;
          }
          return new Result(false);
        }
        iterator = getIterator(iterable, iterFn);
      }
      next = iterator.next;
      while (!(step = functionCall(next, iterator)).done) {
        try {
          result = callFn(step.value);
        } catch (error2) {
          iteratorClose(iterator, "throw", error2);
        }
        if (typeof result == "object" && result && objectIsPrototypeOf(ResultPrototype, result))
          return result;
      }
      return new Result(false);
    };
    var TypeError$1 = global_1.TypeError;
    var anInstance = function(it, Prototype2) {
      if (objectIsPrototypeOf(Prototype2, it))
        return it;
      throw TypeError$1("Incorrect invocation");
    };
    var inheritIfRequired = function($this, dummy, Wrapper) {
      var NewTarget, NewTargetPrototype;
      if (objectSetPrototypeOf && isCallable(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype)
        objectSetPrototypeOf($this, NewTargetPrototype);
      return $this;
    };
    var collection = function(CONSTRUCTOR_NAME, wrapper2, common) {
      var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
      var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
      var ADDER = IS_MAP ? "set" : "add";
      var NativeConstructor = global_1[CONSTRUCTOR_NAME];
      var NativePrototype = NativeConstructor && NativeConstructor.prototype;
      var Constructor2 = NativeConstructor;
      var exported = {};
      var fixMethod = function(KEY) {
        var uncurriedNativeMethod = functionUncurryThis(NativePrototype[KEY]);
        redefine(NativePrototype, KEY, KEY == "add" ? function add(value) {
          uncurriedNativeMethod(this, value === 0 ? 0 : value);
          return this;
        } : KEY == "delete" ? function(key2) {
          return IS_WEAK && !isObject(key2) ? false : uncurriedNativeMethod(this, key2 === 0 ? 0 : key2);
        } : KEY == "get" ? function get2(key2) {
          return IS_WEAK && !isObject(key2) ? void 0 : uncurriedNativeMethod(this, key2 === 0 ? 0 : key2);
        } : KEY == "has" ? function has2(key2) {
          return IS_WEAK && !isObject(key2) ? false : uncurriedNativeMethod(this, key2 === 0 ? 0 : key2);
        } : function set2(key2, value) {
          uncurriedNativeMethod(this, key2 === 0 ? 0 : key2, value);
          return this;
        });
      };
      var REPLACE = isForced_1(CONSTRUCTOR_NAME, !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function() {
        new NativeConstructor().entries().next();
      })));
      if (REPLACE) {
        Constructor2 = common.getConstructor(wrapper2, CONSTRUCTOR_NAME, IS_MAP, ADDER);
        internalMetadata.enable();
      } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
        var instance = new Constructor2();
        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
        var THROWS_ON_PRIMITIVES = fails(function() {
          instance.has(1);
        });
        var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function(iterable) {
          new NativeConstructor(iterable);
        });
        var BUGGY_ZERO = !IS_WEAK && fails(function() {
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--)
            $instance[ADDER](index, index);
          return !$instance.has(-0);
        });
        if (!ACCEPT_ITERABLES) {
          Constructor2 = wrapper2(function(dummy, iterable) {
            anInstance(dummy, NativePrototype);
            var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor2);
            if (iterable != void 0)
              iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
            return that;
          });
          Constructor2.prototype = NativePrototype;
          NativePrototype.constructor = Constructor2;
        }
        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod("delete");
          fixMethod("has");
          IS_MAP && fixMethod("get");
        }
        if (BUGGY_ZERO || HASNT_CHAINING)
          fixMethod(ADDER);
        if (IS_WEAK && NativePrototype.clear)
          delete NativePrototype.clear;
      }
      exported[CONSTRUCTOR_NAME] = Constructor2;
      _export({ global: true, forced: Constructor2 != NativeConstructor }, exported);
      setToStringTag(Constructor2, CONSTRUCTOR_NAME);
      if (!IS_WEAK)
        common.setStrong(Constructor2, CONSTRUCTOR_NAME, IS_MAP);
      return Constructor2;
    };
    var redefineAll = function(target, src, options) {
      for (var key2 in src)
        redefine(target, key2, src[key2], options);
      return target;
    };
    var SPECIES = wellKnownSymbol("species");
    var setSpecies = function(CONSTRUCTOR_NAME) {
      var Constructor2 = getBuiltIn(CONSTRUCTOR_NAME);
      var defineProperty2 = objectDefineProperty.f;
      if (descriptors && Constructor2 && !Constructor2[SPECIES]) {
        defineProperty2(Constructor2, SPECIES, {
          configurable: true,
          get: function() {
            return this;
          }
        });
      }
    };
    var defineProperty = objectDefineProperty.f;
    var fastKey = internalMetadata.fastKey;
    var setInternalState = internalState.set;
    var internalStateGetterFor = internalState.getterFor;
    var collectionStrong = {
      getConstructor: function(wrapper2, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var Constructor2 = wrapper2(function(that, iterable) {
          anInstance(that, Prototype2);
          setInternalState(that, {
            type: CONSTRUCTOR_NAME,
            index: objectCreate(null),
            first: void 0,
            last: void 0,
            size: 0
          });
          if (!descriptors)
            that.size = 0;
          if (iterable != void 0)
            iterate(iterable, that[ADDER], { that, AS_ENTRIES: IS_MAP });
        });
        var Prototype2 = Constructor2.prototype;
        var getInternalState2 = internalStateGetterFor(CONSTRUCTOR_NAME);
        var define = function(that, key2, value) {
          var state = getInternalState2(that);
          var entry4 = getEntry(that, key2);
          var previous, index;
          if (entry4) {
            entry4.value = value;
          } else {
            state.last = entry4 = {
              index: index = fastKey(key2, true),
              key: key2,
              value,
              previous: previous = state.last,
              next: void 0,
              removed: false
            };
            if (!state.first)
              state.first = entry4;
            if (previous)
              previous.next = entry4;
            if (descriptors)
              state.size++;
            else
              that.size++;
            if (index !== "F")
              state.index[index] = entry4;
          }
          return that;
        };
        var getEntry = function(that, key2) {
          var state = getInternalState2(that);
          var index = fastKey(key2);
          var entry4;
          if (index !== "F")
            return state.index[index];
          for (entry4 = state.first; entry4; entry4 = entry4.next) {
            if (entry4.key == key2)
              return entry4;
          }
        };
        redefineAll(Prototype2, {
          clear: function clear() {
            var that = this;
            var state = getInternalState2(that);
            var data2 = state.index;
            var entry4 = state.first;
            while (entry4) {
              entry4.removed = true;
              if (entry4.previous)
                entry4.previous = entry4.previous.next = void 0;
              delete data2[entry4.index];
              entry4 = entry4.next;
            }
            state.first = state.last = void 0;
            if (descriptors)
              state.size = 0;
            else
              that.size = 0;
          },
          "delete": function(key2) {
            var that = this;
            var state = getInternalState2(that);
            var entry4 = getEntry(that, key2);
            if (entry4) {
              var next = entry4.next;
              var prev = entry4.previous;
              delete state.index[entry4.index];
              entry4.removed = true;
              if (prev)
                prev.next = next;
              if (next)
                next.previous = prev;
              if (state.first == entry4)
                state.first = next;
              if (state.last == entry4)
                state.last = prev;
              if (descriptors)
                state.size--;
              else
                that.size--;
            }
            return !!entry4;
          },
          forEach: function forEach(callbackfn) {
            var state = getInternalState2(this);
            var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : void 0);
            var entry4;
            while (entry4 = entry4 ? entry4.next : state.first) {
              boundFunction(entry4.value, entry4.key, this);
              while (entry4 && entry4.removed)
                entry4 = entry4.previous;
            }
          },
          has: function has2(key2) {
            return !!getEntry(this, key2);
          }
        });
        redefineAll(Prototype2, IS_MAP ? {
          get: function get2(key2) {
            var entry4 = getEntry(this, key2);
            return entry4 && entry4.value;
          },
          set: function set2(key2, value) {
            return define(this, key2 === 0 ? 0 : key2, value);
          }
        } : {
          add: function add(value) {
            return define(this, value = value === 0 ? 0 : value, value);
          }
        });
        if (descriptors)
          defineProperty(Prototype2, "size", {
            get: function() {
              return getInternalState2(this).size;
            }
          });
        return Constructor2;
      },
      setStrong: function(Constructor2, CONSTRUCTOR_NAME, IS_MAP) {
        var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
        var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
        var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
        defineIterator(Constructor2, CONSTRUCTOR_NAME, function(iterated, kind) {
          setInternalState(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind,
            last: void 0
          });
        }, function() {
          var state = getInternalIteratorState(this);
          var kind = state.kind;
          var entry4 = state.last;
          while (entry4 && entry4.removed)
            entry4 = entry4.previous;
          if (!state.target || !(state.last = entry4 = entry4 ? entry4.next : state.state.first)) {
            state.target = void 0;
            return { value: void 0, done: true };
          }
          if (kind == "keys")
            return { value: entry4.key, done: false };
          if (kind == "values")
            return { value: entry4.value, done: false };
          return { value: [entry4.key, entry4.value], done: false };
        }, IS_MAP ? "entries" : "values", !IS_MAP, true);
        setSpecies(CONSTRUCTOR_NAME);
      }
    };
    collectionStrong.getConstructor;
    collectionStrong.setStrong;
    collection("Set", function(init2) {
      return function Set2() {
        return init2(this, arguments.length ? arguments[0] : void 0);
      };
    }, collectionStrong);
    path.Set;
    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(function(value) {
        return constructor.resolve(callback()).then(function() {
          return value;
        });
      }, function(reason) {
        return constructor.resolve(callback()).then(function() {
          return constructor.reject(reason);
        });
      });
    }
    function allSettled(arr) {
      var P = this;
      return new P(function(resolve3, reject2) {
        if (!(arr && typeof arr.length !== "undefined")) {
          return reject2(new TypeError(typeof arr + " " + arr + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
        }
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0)
          return resolve3([]);
        var remaining = args.length;
        function res(i3, val) {
          if (val && (typeof val === "object" || typeof val === "function")) {
            var then = val.then;
            if (typeof then === "function") {
              then.call(val, function(val2) {
                res(i3, val2);
              }, function(e2) {
                args[i3] = { status: "rejected", reason: e2 };
                if (--remaining === 0) {
                  resolve3(args);
                }
              });
              return;
            }
          }
          args[i3] = { status: "fulfilled", value: val };
          if (--remaining === 0) {
            resolve3(args);
          }
        }
        for (var i2 = 0; i2 < args.length; i2++) {
          res(i2, args[i2]);
        }
      });
    }
    var setTimeoutFunc = setTimeout;
    var setImmediateFunc = typeof setImmediate !== "undefined" ? setImmediate : null;
    function isArray(x2) {
      return Boolean(x2 && typeof x2.length !== "undefined");
    }
    function noop4() {
    }
    function bind(fn, thisArg) {
      return function() {
        fn.apply(thisArg, arguments);
      };
    }
    function Promise$1(fn) {
      if (!(this instanceof Promise$1))
        throw new TypeError("Promises must be constructed via new");
      if (typeof fn !== "function")
        throw new TypeError("not a function");
      this._state = 0;
      this._handled = false;
      this._value = void 0;
      this._deferreds = [];
      doResolve(fn, this);
    }
    function handle(self2, deferred) {
      while (self2._state === 3) {
        self2 = self2._value;
      }
      if (self2._state === 0) {
        self2._deferreds.push(deferred);
        return;
      }
      self2._handled = true;
      Promise$1._immediateFn(function() {
        var cb = self2._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self2._state === 1 ? resolve2 : reject)(deferred.promise, self2._value);
          return;
        }
        var ret;
        try {
          ret = cb(self2._value);
        } catch (e2) {
          reject(deferred.promise, e2);
          return;
        }
        resolve2(deferred.promise, ret);
      });
    }
    function resolve2(self2, newValue) {
      try {
        if (newValue === self2)
          throw new TypeError("A promise cannot be resolved with itself.");
        if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
          var then = newValue.then;
          if (newValue instanceof Promise$1) {
            self2._state = 3;
            self2._value = newValue;
            finale(self2);
            return;
          } else if (typeof then === "function") {
            doResolve(bind(then, newValue), self2);
            return;
          }
        }
        self2._state = 1;
        self2._value = newValue;
        finale(self2);
      } catch (e2) {
        reject(self2, e2);
      }
    }
    function reject(self2, newValue) {
      self2._state = 2;
      self2._value = newValue;
      finale(self2);
    }
    function finale(self2) {
      if (self2._state === 2 && self2._deferreds.length === 0) {
        Promise$1._immediateFn(function() {
          if (!self2._handled) {
            Promise$1._unhandledRejectionFn(self2._value);
          }
        });
      }
      for (var i2 = 0, len = self2._deferreds.length; i2 < len; i2++) {
        handle(self2, self2._deferreds[i2]);
      }
      self2._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
      this.onRejected = typeof onRejected === "function" ? onRejected : null;
      this.promise = promise;
    }
    function doResolve(fn, self2) {
      var done = false;
      try {
        fn(function(value) {
          if (done)
            return;
          done = true;
          resolve2(self2, value);
        }, function(reason) {
          if (done)
            return;
          done = true;
          reject(self2, reason);
        });
      } catch (ex) {
        if (done)
          return;
        done = true;
        reject(self2, ex);
      }
    }
    Promise$1.prototype["catch"] = function(onRejected) {
      return this.then(null, onRejected);
    };
    Promise$1.prototype.then = function(onFulfilled, onRejected) {
      var prom = new this.constructor(noop4);
      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };
    Promise$1.prototype["finally"] = finallyConstructor;
    Promise$1.all = function(arr) {
      return new Promise$1(function(resolve3, reject2) {
        if (!isArray(arr)) {
          return reject2(new TypeError("Promise.all accepts an array"));
        }
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0)
          return resolve3([]);
        var remaining = args.length;
        function res(i3, val) {
          try {
            if (val && (typeof val === "object" || typeof val === "function")) {
              var then = val.then;
              if (typeof then === "function") {
                then.call(val, function(val2) {
                  res(i3, val2);
                }, reject2);
                return;
              }
            }
            args[i3] = val;
            if (--remaining === 0) {
              resolve3(args);
            }
          } catch (ex) {
            reject2(ex);
          }
        }
        for (var i2 = 0; i2 < args.length; i2++) {
          res(i2, args[i2]);
        }
      });
    };
    Promise$1.allSettled = allSettled;
    Promise$1.resolve = function(value) {
      if (value && typeof value === "object" && value.constructor === Promise$1) {
        return value;
      }
      return new Promise$1(function(resolve3) {
        resolve3(value);
      });
    };
    Promise$1.reject = function(value) {
      return new Promise$1(function(resolve3, reject2) {
        reject2(value);
      });
    };
    Promise$1.race = function(arr) {
      return new Promise$1(function(resolve3, reject2) {
        if (!isArray(arr)) {
          return reject2(new TypeError("Promise.race accepts an array"));
        }
        for (var i2 = 0, len = arr.length; i2 < len; i2++) {
          Promise$1.resolve(arr[i2]).then(resolve3, reject2);
        }
      });
    };
    Promise$1._immediateFn = typeof setImmediateFunc === "function" && function(fn) {
      setImmediateFunc(fn);
    } || function(fn) {
      setTimeoutFunc(fn, 0);
    };
    Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== "undefined" && console) {
        console.warn("Possible Unhandled Promise Rejection:", err);
      }
    };
    var globalNS = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    }();
    if (typeof globalNS["Promise"] !== "function") {
      globalNS["Promise"] = Promise$1;
    } else {
      if (!globalNS.Promise.prototype["finally"]) {
        globalNS.Promise.prototype["finally"] = finallyConstructor;
      }
      if (!globalNS.Promise.allSettled) {
        globalNS.Promise.allSettled = allSettled;
      }
    }
    (function(factory) {
      factory();
    })(function() {
      function _classCallCheck(instance, Constructor2) {
        if (!(instance instanceof Constructor2)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i2 = 0; i2 < props.length; i2++) {
          var descriptor = props[i2];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor2, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor2.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor2, staticProps);
        return Constructor2;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        if (superClass)
          _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e2) {
          return false;
        }
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _possibleConstructorReturn(self2, call2) {
        if (call2 && (typeof call2 === "object" || typeof call2 === "function")) {
          return call2;
        }
        return _assertThisInitialized(self2);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object);
          if (object === null)
            break;
        }
        return object;
      }
      function _get(target, property, receiver) {
        if (typeof Reflect !== "undefined" && Reflect.get) {
          _get = Reflect.get;
        } else {
          _get = function _get2(target2, property2, receiver2) {
            var base2 = _superPropBase(target2, property2);
            if (!base2)
              return;
            var desc = Object.getOwnPropertyDescriptor(base2, property2);
            if (desc.get) {
              return desc.get.call(receiver2);
            }
            return desc.value;
          };
        }
        return _get(target, property, receiver || target);
      }
      var Emitter = /* @__PURE__ */ function() {
        function Emitter2() {
          _classCallCheck(this, Emitter2);
          Object.defineProperty(this, "listeners", {
            value: {},
            writable: true,
            configurable: true
          });
        }
        _createClass(Emitter2, [{
          key: "addEventListener",
          value: function addEventListener(type, callback, options) {
            if (!(type in this.listeners)) {
              this.listeners[type] = [];
            }
            this.listeners[type].push({
              callback,
              options
            });
          }
        }, {
          key: "removeEventListener",
          value: function removeEventListener(type, callback) {
            if (!(type in this.listeners)) {
              return;
            }
            var stack = this.listeners[type];
            for (var i2 = 0, l = stack.length; i2 < l; i2++) {
              if (stack[i2].callback === callback) {
                stack.splice(i2, 1);
                return;
              }
            }
          }
        }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
            if (!(event.type in this.listeners)) {
              return;
            }
            var stack = this.listeners[event.type];
            var stackToCall = stack.slice();
            for (var i2 = 0, l = stackToCall.length; i2 < l; i2++) {
              var listener = stackToCall[i2];
              try {
                listener.callback.call(this, event);
              } catch (e2) {
                Promise.resolve().then(function() {
                  throw e2;
                });
              }
              if (listener.options && listener.options.once) {
                this.removeEventListener(event.type, listener.callback);
              }
            }
            return !event.defaultPrevented;
          }
        }]);
        return Emitter2;
      }();
      var AbortSignal = /* @__PURE__ */ function(_Emitter) {
        _inherits(AbortSignal2, _Emitter);
        var _super = _createSuper(AbortSignal2);
        function AbortSignal2() {
          var _this;
          _classCallCheck(this, AbortSignal2);
          _this = _super.call(this);
          if (!_this.listeners) {
            Emitter.call(_assertThisInitialized(_this));
          }
          Object.defineProperty(_assertThisInitialized(_this), "aborted", {
            value: false,
            writable: true,
            configurable: true
          });
          Object.defineProperty(_assertThisInitialized(_this), "onabort", {
            value: null,
            writable: true,
            configurable: true
          });
          return _this;
        }
        _createClass(AbortSignal2, [{
          key: "toString",
          value: function toString2() {
            return "[object AbortSignal]";
          }
        }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
            if (event.type === "abort") {
              this.aborted = true;
              if (typeof this.onabort === "function") {
                this.onabort.call(this, event);
              }
            }
            _get(_getPrototypeOf(AbortSignal2.prototype), "dispatchEvent", this).call(this, event);
          }
        }]);
        return AbortSignal2;
      }(Emitter);
      var AbortController2 = /* @__PURE__ */ function() {
        function AbortController3() {
          _classCallCheck(this, AbortController3);
          Object.defineProperty(this, "signal", {
            value: new AbortSignal(),
            writable: true,
            configurable: true
          });
        }
        _createClass(AbortController3, [{
          key: "abort",
          value: function abort() {
            var event;
            try {
              event = new Event("abort");
            } catch (e2) {
              if (typeof document !== "undefined") {
                if (!document.createEvent) {
                  event = document.createEventObject();
                  event.type = "abort";
                } else {
                  event = document.createEvent("Event");
                  event.initEvent("abort", false, false);
                }
              } else {
                event = {
                  type: "abort",
                  bubbles: false,
                  cancelable: false
                };
              }
            }
            this.signal.dispatchEvent(event);
          }
        }, {
          key: "toString",
          value: function toString2() {
            return "[object AbortController]";
          }
        }]);
        return AbortController3;
      }();
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        AbortController2.prototype[Symbol.toStringTag] = "AbortController";
        AbortSignal.prototype[Symbol.toStringTag] = "AbortSignal";
      }
      function polyfillNeeded(self2) {
        if (self2.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
          console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill");
          return true;
        }
        return typeof self2.Request === "function" && !self2.Request.prototype.hasOwnProperty("signal") || !self2.AbortController;
      }
      (function(self2) {
        if (!polyfillNeeded(self2)) {
          return;
        }
        self2.AbortController = AbortController2;
        self2.AbortSignal = AbortSignal;
      })(typeof self !== "undefined" ? self : commonjsGlobal2);
    });
    var version = "1.20.0";
    var DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS = 60;
    var DEFAULT_POPUP_CONFIG_OPTIONS = {
      timeoutInSeconds: DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS
    };
    var DEFAULT_SILENT_TOKEN_RETRY_COUNT = 3;
    var CLEANUP_IFRAME_TIMEOUT_IN_SECONDS = 2;
    var DEFAULT_FETCH_TIMEOUT_MS = 1e4;
    var CACHE_LOCATION_MEMORY = "memory";
    var MISSING_REFRESH_TOKEN_ERROR_MESSAGE = "The web worker is missing the refresh token";
    var INVALID_REFRESH_TOKEN_ERROR_MESSAGE = "invalid refresh token";
    var DEFAULT_SCOPE = "openid profile email";
    var RECOVERABLE_ERRORS = [
      "login_required",
      "consent_required",
      "interaction_required",
      "account_selection_required",
      "access_denied"
    ];
    var DEFAULT_SESSION_CHECK_EXPIRY_DAYS = 1;
    var DEFAULT_AUTH0_CLIENT = {
      name: "auth0-spa-js",
      version
    };
    var DEFAULT_NOW_PROVIDER = function() {
      return Date.now();
    };
    var GenericError = function(_super) {
      __extends(GenericError2, _super);
      function GenericError2(error2, error_description) {
        var _this = _super.call(this, error_description) || this;
        _this.error = error2;
        _this.error_description = error_description;
        Object.setPrototypeOf(_this, GenericError2.prototype);
        return _this;
      }
      GenericError2.fromPayload = function(_a4) {
        var error2 = _a4.error, error_description = _a4.error_description;
        return new GenericError2(error2, error_description);
      };
      return GenericError2;
    }(Error);
    var AuthenticationError = function(_super) {
      __extends(AuthenticationError2, _super);
      function AuthenticationError2(error2, error_description, state, appState) {
        if (appState === void 0) {
          appState = null;
        }
        var _this = _super.call(this, error2, error_description) || this;
        _this.state = state;
        _this.appState = appState;
        Object.setPrototypeOf(_this, AuthenticationError2.prototype);
        return _this;
      }
      return AuthenticationError2;
    }(GenericError);
    var TimeoutError = function(_super) {
      __extends(TimeoutError2, _super);
      function TimeoutError2() {
        var _this = _super.call(this, "timeout", "Timeout") || this;
        Object.setPrototypeOf(_this, TimeoutError2.prototype);
        return _this;
      }
      return TimeoutError2;
    }(GenericError);
    var PopupTimeoutError = function(_super) {
      __extends(PopupTimeoutError2, _super);
      function PopupTimeoutError2(popup) {
        var _this = _super.call(this) || this;
        _this.popup = popup;
        Object.setPrototypeOf(_this, PopupTimeoutError2.prototype);
        return _this;
      }
      return PopupTimeoutError2;
    }(TimeoutError);
    var PopupCancelledError = function(_super) {
      __extends(PopupCancelledError2, _super);
      function PopupCancelledError2(popup) {
        var _this = _super.call(this, "cancelled", "Popup closed") || this;
        _this.popup = popup;
        Object.setPrototypeOf(_this, PopupCancelledError2.prototype);
        return _this;
      }
      return PopupCancelledError2;
    }(GenericError);
    var MfaRequiredError = function(_super) {
      __extends(MfaRequiredError2, _super);
      function MfaRequiredError2(error2, error_description, mfa_token) {
        var _this = _super.call(this, error2, error_description) || this;
        _this.mfa_token = mfa_token;
        Object.setPrototypeOf(_this, MfaRequiredError2.prototype);
        return _this;
      }
      return MfaRequiredError2;
    }(GenericError);
    var parseQueryResult = function(queryString) {
      if (queryString.indexOf("#") > -1) {
        queryString = queryString.substr(0, queryString.indexOf("#"));
      }
      var queryParams = queryString.split("&");
      var parsedQuery = {};
      queryParams.forEach(function(qp) {
        var _a4 = __read(qp.split("="), 2), key2 = _a4[0], val = _a4[1];
        parsedQuery[key2] = decodeURIComponent(val);
      });
      if (parsedQuery.expires_in) {
        parsedQuery.expires_in = parseInt(parsedQuery.expires_in);
      }
      return parsedQuery;
    };
    var runIframe = function(authorizeUrl, eventOrigin, timeoutInSeconds) {
      if (timeoutInSeconds === void 0) {
        timeoutInSeconds = DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS;
      }
      return new Promise(function(res, rej) {
        var iframe = window.document.createElement("iframe");
        iframe.setAttribute("width", "0");
        iframe.setAttribute("height", "0");
        iframe.style.display = "none";
        var removeIframe = function() {
          if (window.document.body.contains(iframe)) {
            window.document.body.removeChild(iframe);
            window.removeEventListener("message", iframeEventHandler, false);
          }
        };
        var iframeEventHandler;
        var timeoutSetTimeoutId = setTimeout(function() {
          rej(new TimeoutError());
          removeIframe();
        }, timeoutInSeconds * 1e3);
        iframeEventHandler = function(e2) {
          if (e2.origin != eventOrigin)
            return;
          if (!e2.data || e2.data.type !== "authorization_response")
            return;
          var eventSource = e2.source;
          if (eventSource) {
            eventSource.close();
          }
          e2.data.response.error ? rej(GenericError.fromPayload(e2.data.response)) : res(e2.data.response);
          clearTimeout(timeoutSetTimeoutId);
          window.removeEventListener("message", iframeEventHandler, false);
          setTimeout(removeIframe, CLEANUP_IFRAME_TIMEOUT_IN_SECONDS * 1e3);
        };
        window.addEventListener("message", iframeEventHandler, false);
        window.document.body.appendChild(iframe);
        iframe.setAttribute("src", authorizeUrl);
      });
    };
    var openPopup = function(url) {
      var width = 400;
      var height = 600;
      var left = window.screenX + (window.innerWidth - width) / 2;
      var top = window.screenY + (window.innerHeight - height) / 2;
      return window.open(url, "auth0:authorize:popup", "left=".concat(left, ",top=").concat(top, ",width=").concat(width, ",height=").concat(height, ",resizable,scrollbars=yes,status=1"));
    };
    var runPopup = function(config) {
      return new Promise(function(resolve3, reject2) {
        var popupEventListener;
        var popupTimer = setInterval(function() {
          if (config.popup && config.popup.closed) {
            clearInterval(popupTimer);
            clearTimeout(timeoutId);
            window.removeEventListener("message", popupEventListener, false);
            reject2(new PopupCancelledError(config.popup));
          }
        }, 1e3);
        var timeoutId = setTimeout(function() {
          clearInterval(popupTimer);
          reject2(new PopupTimeoutError(config.popup));
          window.removeEventListener("message", popupEventListener, false);
        }, (config.timeoutInSeconds || DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS) * 1e3);
        popupEventListener = function(e2) {
          if (!e2.data || e2.data.type !== "authorization_response") {
            return;
          }
          clearTimeout(timeoutId);
          clearInterval(popupTimer);
          window.removeEventListener("message", popupEventListener, false);
          config.popup.close();
          if (e2.data.response.error) {
            return reject2(GenericError.fromPayload(e2.data.response));
          }
          resolve3(e2.data.response);
        };
        window.addEventListener("message", popupEventListener);
      });
    };
    var getCrypto = function() {
      return window.crypto || window.msCrypto;
    };
    var getCryptoSubtle = function() {
      var crypto2 = getCrypto();
      return crypto2.subtle || crypto2.webkitSubtle;
    };
    var createRandomString = function() {
      var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
      var random = "";
      var randomValues = Array.from(getCrypto().getRandomValues(new Uint8Array(43)));
      randomValues.forEach(function(v) {
        return random += charset[v % charset.length];
      });
      return random;
    };
    var encode2 = function(value) {
      return btoa(value);
    };
    var createQueryParams = function(params) {
      return Object.keys(params).filter(function(k) {
        return typeof params[k] !== "undefined";
      }).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      }).join("&");
    };
    var sha2562 = function(s3) {
      return __awaiter(void 0, void 0, void 0, function() {
        var digestOp;
        return __generator(this, function(_a4) {
          switch (_a4.label) {
            case 0:
              digestOp = getCryptoSubtle().digest({ name: "SHA-256" }, new TextEncoder().encode(s3));
              if (window.msCrypto) {
                return [2, new Promise(function(res, rej) {
                  digestOp.oncomplete = function(e2) {
                    res(e2.target.result);
                  };
                  digestOp.onerror = function(e2) {
                    rej(e2.error);
                  };
                  digestOp.onabort = function() {
                    rej("The digest operation was aborted");
                  };
                })];
              }
              return [4, digestOp];
            case 1:
              return [2, _a4.sent()];
          }
        });
      });
    };
    var urlEncodeB64 = function(input) {
      var b64Chars = { "+": "-", "/": "_", "=": "" };
      return input.replace(/[+/=]/g, function(m2) {
        return b64Chars[m2];
      });
    };
    var decodeB64 = function(input) {
      return decodeURIComponent(atob(input).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    };
    var urlDecodeB64 = function(input) {
      return decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));
    };
    var bufferToBase64UrlEncoded = function(input) {
      var ie11SafeInput = new Uint8Array(input);
      return urlEncodeB64(window.btoa(String.fromCharCode.apply(String, __spreadArray([], __read(Array.from(ie11SafeInput)), false))));
    };
    var validateCrypto = function() {
      if (!getCrypto()) {
        throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
      }
      if (typeof getCryptoSubtle() === "undefined") {
        throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ");
      }
    };
    var sendMessage = function(message, to) {
      return new Promise(function(resolve3, reject2) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.error) {
            reject2(new Error(event.data.error));
          } else {
            resolve3(event.data);
          }
        };
        to.postMessage(message, [messageChannel.port2]);
      });
    };
    var createAbortController = function() {
      return new AbortController();
    };
    var dofetch = function(fetchUrl, fetchOptions) {
      return __awaiter(void 0, void 0, void 0, function() {
        var response;
        var _a4;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, fetch__default["default"](fetchUrl, fetchOptions)];
            case 1:
              response = _b.sent();
              _a4 = {
                ok: response.ok
              };
              return [4, response.json()];
            case 2:
              return [2, (_a4.json = _b.sent(), _a4)];
          }
        });
      });
    };
    var fetchWithoutWorker = function(fetchUrl, fetchOptions, timeout) {
      return __awaiter(void 0, void 0, void 0, function() {
        var controller, timeoutId;
        return __generator(this, function(_a4) {
          controller = createAbortController();
          fetchOptions.signal = controller.signal;
          return [2, Promise.race([
            dofetch(fetchUrl, fetchOptions),
            new Promise(function(_, reject2) {
              timeoutId = setTimeout(function() {
                controller.abort();
                reject2(new Error("Timeout when executing 'fetch'"));
              }, timeout);
            })
          ]).finally(function() {
            clearTimeout(timeoutId);
          })];
        });
      });
    };
    var fetchWithWorker = function(fetchUrl, audience, scope, fetchOptions, timeout, worker, useFormData) {
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a4) {
          return [2, sendMessage({
            auth: {
              audience,
              scope
            },
            timeout,
            fetchUrl,
            fetchOptions,
            useFormData
          }, worker)];
        });
      });
    };
    var switchFetch = function(fetchUrl, audience, scope, fetchOptions, worker, useFormData, timeout) {
      if (timeout === void 0) {
        timeout = DEFAULT_FETCH_TIMEOUT_MS;
      }
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a4) {
          if (worker) {
            return [2, fetchWithWorker(fetchUrl, audience, scope, fetchOptions, timeout, worker, useFormData)];
          } else {
            return [2, fetchWithoutWorker(fetchUrl, fetchOptions, timeout)];
          }
        });
      });
    };
    function getJSON(url, timeout, audience, scope, options, worker, useFormData) {
      return __awaiter(this, void 0, void 0, function() {
        var fetchError, response, i2, e_1, _a4, error2, error_description, data2, ok, errorMessage;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              fetchError = null;
              i2 = 0;
              _b.label = 1;
            case 1:
              if (!(i2 < DEFAULT_SILENT_TOKEN_RETRY_COUNT))
                return [3, 6];
              _b.label = 2;
            case 2:
              _b.trys.push([2, 4, , 5]);
              return [4, switchFetch(url, audience, scope, options, worker, useFormData, timeout)];
            case 3:
              response = _b.sent();
              fetchError = null;
              return [3, 6];
            case 4:
              e_1 = _b.sent();
              fetchError = e_1;
              return [3, 5];
            case 5:
              i2++;
              return [3, 1];
            case 6:
              if (fetchError) {
                fetchError.message = fetchError.message || "Failed to fetch";
                throw fetchError;
              }
              _a4 = response.json, error2 = _a4.error, error_description = _a4.error_description, data2 = __rest(_a4, ["error", "error_description"]), ok = response.ok;
              if (!ok) {
                errorMessage = error_description || "HTTP error. Unable to fetch ".concat(url);
                if (error2 === "mfa_required") {
                  throw new MfaRequiredError(error2, errorMessage, data2.mfa_token);
                }
                throw new GenericError(error2 || "request_error", errorMessage);
              }
              return [2, data2];
          }
        });
      });
    }
    function oauthToken(_a4, worker) {
      var baseUrl = _a4.baseUrl, timeout = _a4.timeout, audience = _a4.audience, scope = _a4.scope, auth0Client = _a4.auth0Client, useFormData = _a4.useFormData, options = __rest(_a4, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData"]);
      return __awaiter(this, void 0, void 0, function() {
        var body;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              body = useFormData ? createQueryParams(options) : JSON.stringify(options);
              return [4, getJSON("".concat(baseUrl, "/oauth/token"), timeout, audience || "default", scope, {
                method: "POST",
                body,
                headers: {
                  "Content-Type": useFormData ? "application/x-www-form-urlencoded" : "application/json",
                  "Auth0-Client": btoa(JSON.stringify(auth0Client || DEFAULT_AUTH0_CLIENT))
                }
              }, worker, useFormData)];
            case 1:
              return [2, _b.sent()];
          }
        });
      });
    }
    var dedupe = function(arr) {
      return Array.from(new Set(arr));
    };
    var getUniqueScopes = function() {
      var scopes = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        scopes[_i] = arguments[_i];
      }
      return dedupe(scopes.join(" ").trim().split(/\s+/)).join(" ");
    };
    var CACHE_KEY_PREFIX = "@@auth0spajs@@";
    var CacheKey = function() {
      function CacheKey2(data2, prefix) {
        if (prefix === void 0) {
          prefix = CACHE_KEY_PREFIX;
        }
        this.prefix = prefix;
        this.client_id = data2.client_id;
        this.scope = data2.scope;
        this.audience = data2.audience;
      }
      CacheKey2.prototype.toKey = function() {
        return "".concat(this.prefix, "::").concat(this.client_id, "::").concat(this.audience, "::").concat(this.scope);
      };
      CacheKey2.fromKey = function(key2) {
        var _a4 = __read(key2.split("::"), 4), prefix = _a4[0], client_id = _a4[1], audience = _a4[2], scope = _a4[3];
        return new CacheKey2({ client_id, scope, audience }, prefix);
      };
      CacheKey2.fromCacheEntry = function(entry4) {
        var scope = entry4.scope, audience = entry4.audience, client_id = entry4.client_id;
        return new CacheKey2({
          scope,
          audience,
          client_id
        });
      };
      return CacheKey2;
    }();
    var LocalStorageCache = function() {
      function LocalStorageCache2() {
      }
      LocalStorageCache2.prototype.set = function(key2, entry4) {
        localStorage.setItem(key2, JSON.stringify(entry4));
      };
      LocalStorageCache2.prototype.get = function(key2) {
        var json = window.localStorage.getItem(key2);
        if (!json)
          return;
        try {
          var payload = JSON.parse(json);
          return payload;
        } catch (e2) {
          return;
        }
      };
      LocalStorageCache2.prototype.remove = function(key2) {
        localStorage.removeItem(key2);
      };
      LocalStorageCache2.prototype.allKeys = function() {
        return Object.keys(window.localStorage).filter(function(key2) {
          return key2.startsWith(CACHE_KEY_PREFIX);
        });
      };
      return LocalStorageCache2;
    }();
    var InMemoryCache = function() {
      function InMemoryCache2() {
        this.enclosedCache = function() {
          var cache = {};
          return {
            set: function(key2, entry4) {
              cache[key2] = entry4;
            },
            get: function(key2) {
              var cacheEntry = cache[key2];
              if (!cacheEntry) {
                return;
              }
              return cacheEntry;
            },
            remove: function(key2) {
              delete cache[key2];
            },
            allKeys: function() {
              return Object.keys(cache);
            }
          };
        }();
      }
      return InMemoryCache2;
    }();
    var DEFAULT_EXPIRY_ADJUSTMENT_SECONDS = 0;
    var CacheManager = function() {
      function CacheManager2(cache, keyManifest, nowProvider) {
        this.cache = cache;
        this.keyManifest = keyManifest;
        this.nowProvider = nowProvider;
        this.nowProvider = this.nowProvider || DEFAULT_NOW_PROVIDER;
      }
      CacheManager2.prototype.get = function(cacheKey, expiryAdjustmentSeconds) {
        var _a4;
        if (expiryAdjustmentSeconds === void 0) {
          expiryAdjustmentSeconds = DEFAULT_EXPIRY_ADJUSTMENT_SECONDS;
        }
        return __awaiter(this, void 0, void 0, function() {
          var wrappedEntry, keys2, matchedKey, now, nowSeconds;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                return [4, this.cache.get(cacheKey.toKey())];
              case 1:
                wrappedEntry = _b.sent();
                if (!!wrappedEntry)
                  return [3, 4];
                return [4, this.getCacheKeys()];
              case 2:
                keys2 = _b.sent();
                if (!keys2)
                  return [2];
                matchedKey = this.matchExistingCacheKey(cacheKey, keys2);
                return [4, this.cache.get(matchedKey)];
              case 3:
                wrappedEntry = _b.sent();
                _b.label = 4;
              case 4:
                if (!wrappedEntry) {
                  return [2];
                }
                return [4, this.nowProvider()];
              case 5:
                now = _b.sent();
                nowSeconds = Math.floor(now / 1e3);
                if (!(wrappedEntry.expiresAt - expiryAdjustmentSeconds < nowSeconds))
                  return [3, 10];
                if (!wrappedEntry.body.refresh_token)
                  return [3, 7];
                wrappedEntry.body = {
                  refresh_token: wrappedEntry.body.refresh_token
                };
                return [4, this.cache.set(cacheKey.toKey(), wrappedEntry)];
              case 6:
                _b.sent();
                return [2, wrappedEntry.body];
              case 7:
                return [4, this.cache.remove(cacheKey.toKey())];
              case 8:
                _b.sent();
                return [4, (_a4 = this.keyManifest) === null || _a4 === void 0 ? void 0 : _a4.remove(cacheKey.toKey())];
              case 9:
                _b.sent();
                return [2];
              case 10:
                return [2, wrappedEntry.body];
            }
          });
        });
      };
      CacheManager2.prototype.set = function(entry4) {
        var _a4;
        return __awaiter(this, void 0, void 0, function() {
          var cacheKey, wrappedEntry;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                cacheKey = new CacheKey({
                  client_id: entry4.client_id,
                  scope: entry4.scope,
                  audience: entry4.audience
                });
                return [4, this.wrapCacheEntry(entry4)];
              case 1:
                wrappedEntry = _b.sent();
                return [4, this.cache.set(cacheKey.toKey(), wrappedEntry)];
              case 2:
                _b.sent();
                return [4, (_a4 = this.keyManifest) === null || _a4 === void 0 ? void 0 : _a4.add(cacheKey.toKey())];
              case 3:
                _b.sent();
                return [2];
            }
          });
        });
      };
      CacheManager2.prototype.clear = function(clientId) {
        var _a4;
        return __awaiter(this, void 0, void 0, function() {
          var keys2;
          var _this = this;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                return [4, this.getCacheKeys()];
              case 1:
                keys2 = _b.sent();
                if (!keys2)
                  return [2];
                return [4, keys2.filter(function(key2) {
                  return clientId ? key2.includes(clientId) : true;
                }).reduce(function(memo, key2) {
                  return __awaiter(_this, void 0, void 0, function() {
                    return __generator(this, function(_a5) {
                      switch (_a5.label) {
                        case 0:
                          return [4, memo];
                        case 1:
                          _a5.sent();
                          return [4, this.cache.remove(key2)];
                        case 2:
                          _a5.sent();
                          return [2];
                      }
                    });
                  });
                }, Promise.resolve())];
              case 2:
                _b.sent();
                return [4, (_a4 = this.keyManifest) === null || _a4 === void 0 ? void 0 : _a4.clear()];
              case 3:
                _b.sent();
                return [2];
            }
          });
        });
      };
      CacheManager2.prototype.clearSync = function(clientId) {
        var _this = this;
        var keys2 = this.cache.allKeys();
        if (!keys2)
          return;
        keys2.filter(function(key2) {
          return clientId ? key2.includes(clientId) : true;
        }).forEach(function(key2) {
          _this.cache.remove(key2);
        });
      };
      CacheManager2.prototype.wrapCacheEntry = function(entry4) {
        return __awaiter(this, void 0, void 0, function() {
          var now, expiresInTime, expirySeconds;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, this.nowProvider()];
              case 1:
                now = _a4.sent();
                expiresInTime = Math.floor(now / 1e3) + entry4.expires_in;
                expirySeconds = Math.min(expiresInTime, entry4.decodedToken.claims.exp);
                return [2, {
                  body: entry4,
                  expiresAt: expirySeconds
                }];
            }
          });
        });
      };
      CacheManager2.prototype.getCacheKeys = function() {
        var _a4;
        return __awaiter(this, void 0, void 0, function() {
          var _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
              case 0:
                if (!this.keyManifest)
                  return [3, 2];
                return [4, this.keyManifest.get()];
              case 1:
                _b = (_a4 = _c.sent()) === null || _a4 === void 0 ? void 0 : _a4.keys;
                return [3, 4];
              case 2:
                return [4, this.cache.allKeys()];
              case 3:
                _b = _c.sent();
                _c.label = 4;
              case 4:
                return [2, _b];
            }
          });
        });
      };
      CacheManager2.prototype.matchExistingCacheKey = function(keyToMatch, allKeys) {
        return allKeys.filter(function(key2) {
          var cacheKey = CacheKey.fromKey(key2);
          var scopeSet = new Set(cacheKey.scope && cacheKey.scope.split(" "));
          var scopesToMatch = keyToMatch.scope.split(" ");
          var hasAllScopes = cacheKey.scope && scopesToMatch.reduce(function(acc, current) {
            return acc && scopeSet.has(current);
          }, true);
          return cacheKey.prefix === CACHE_KEY_PREFIX && cacheKey.client_id === keyToMatch.client_id && cacheKey.audience === keyToMatch.audience && hasAllScopes;
        })[0];
      };
      return CacheManager2;
    }();
    var TRANSACTION_STORAGE_KEY_PREFIX = "a0.spajs.txs";
    var TransactionManager = function() {
      function TransactionManager2(storage, clientId) {
        this.storage = storage;
        this.clientId = clientId;
        this.storageKey = "".concat(TRANSACTION_STORAGE_KEY_PREFIX, ".").concat(this.clientId);
        this.transaction = this.storage.get(this.storageKey);
      }
      TransactionManager2.prototype.create = function(transaction) {
        this.transaction = transaction;
        this.storage.save(this.storageKey, transaction, {
          daysUntilExpire: 1
        });
      };
      TransactionManager2.prototype.get = function() {
        return this.transaction;
      };
      TransactionManager2.prototype.remove = function() {
        delete this.transaction;
        this.storage.remove(this.storageKey);
      };
      return TransactionManager2;
    }();
    var isNumber = function(n) {
      return typeof n === "number";
    };
    var idTokendecoded = [
      "iss",
      "aud",
      "exp",
      "nbf",
      "iat",
      "jti",
      "azp",
      "nonce",
      "auth_time",
      "at_hash",
      "c_hash",
      "acr",
      "amr",
      "sub_jwk",
      "cnf",
      "sip_from_tag",
      "sip_date",
      "sip_callid",
      "sip_cseq_num",
      "sip_via_branch",
      "orig",
      "dest",
      "mky",
      "events",
      "toe",
      "txn",
      "rph",
      "sid",
      "vot",
      "vtm"
    ];
    var decode = function(token) {
      var parts = token.split(".");
      var _a4 = __read(parts, 3), header = _a4[0], payload = _a4[1], signature = _a4[2];
      if (parts.length !== 3 || !header || !payload || !signature) {
        throw new Error("ID token could not be decoded");
      }
      var payloadJSON = JSON.parse(urlDecodeB64(payload));
      var claims = { __raw: token };
      var user2 = {};
      Object.keys(payloadJSON).forEach(function(k) {
        claims[k] = payloadJSON[k];
        if (!idTokendecoded.includes(k)) {
          user2[k] = payloadJSON[k];
        }
      });
      return {
        encoded: { header, payload, signature },
        header: JSON.parse(urlDecodeB64(header)),
        claims,
        user: user2
      };
    };
    var verify = function(options) {
      if (!options.id_token) {
        throw new Error("ID token is required but missing");
      }
      var decoded = decode(options.id_token);
      if (!decoded.claims.iss) {
        throw new Error("Issuer (iss) claim must be a string present in the ID token");
      }
      if (decoded.claims.iss !== options.iss) {
        throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'.concat(options.iss, '", found "').concat(decoded.claims.iss, '"'));
      }
      if (!decoded.user.sub) {
        throw new Error("Subject (sub) claim must be a string present in the ID token");
      }
      if (decoded.header.alg !== "RS256") {
        throw new Error('Signature algorithm of "'.concat(decoded.header.alg, '" is not supported. Expected the ID token to be signed with "RS256".'));
      }
      if (!decoded.claims.aud || !(typeof decoded.claims.aud === "string" || Array.isArray(decoded.claims.aud))) {
        throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
      }
      if (Array.isArray(decoded.claims.aud)) {
        if (!decoded.claims.aud.includes(options.aud)) {
          throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(options.aud, '" but was not one of "').concat(decoded.claims.aud.join(", "), '"'));
        }
        if (decoded.claims.aud.length > 1) {
          if (!decoded.claims.azp) {
            throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
          }
          if (decoded.claims.azp !== options.aud) {
            throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'.concat(options.aud, '", found "').concat(decoded.claims.azp, '"'));
          }
        }
      } else if (decoded.claims.aud !== options.aud) {
        throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(options.aud, '" but found "').concat(decoded.claims.aud, '"'));
      }
      if (options.nonce) {
        if (!decoded.claims.nonce) {
          throw new Error("Nonce (nonce) claim must be a string present in the ID token");
        }
        if (decoded.claims.nonce !== options.nonce) {
          throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'.concat(options.nonce, '", found "').concat(decoded.claims.nonce, '"'));
        }
      }
      if (options.max_age && !isNumber(decoded.claims.auth_time)) {
        throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
      }
      if (!isNumber(decoded.claims.exp)) {
        throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
      }
      if (!isNumber(decoded.claims.iat)) {
        throw new Error("Issued At (iat) claim must be a number present in the ID token");
      }
      var leeway = options.leeway || 60;
      var now = new Date(options.now || Date.now());
      var expDate = new Date(0);
      var nbfDate = new Date(0);
      var authTimeDate = new Date(0);
      authTimeDate.setUTCSeconds(parseInt(decoded.claims.auth_time) + options.max_age + leeway);
      expDate.setUTCSeconds(decoded.claims.exp + leeway);
      nbfDate.setUTCSeconds(decoded.claims.nbf - leeway);
      if (now > expDate) {
        throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(now, ") is after expiration time (").concat(expDate, ")"));
      }
      if (isNumber(decoded.claims.nbf) && now < nbfDate) {
        throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time (".concat(now, ") is before ").concat(nbfDate));
      }
      if (isNumber(decoded.claims.auth_time) && now > authTimeDate) {
        throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time (".concat(now, ") is after last auth at ").concat(authTimeDate));
      }
      if (options.organizationId) {
        if (!decoded.claims.org_id) {
          throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
        } else if (options.organizationId !== decoded.claims.org_id) {
          throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'.concat(options.organizationId, '", found "').concat(decoded.claims.org_id, '"'));
        }
      }
      return decoded;
    };
    var CookieStorage = {
      get: function(key2) {
        var value = Cookies__namespace.get(key2);
        if (typeof value === "undefined") {
          return;
        }
        return JSON.parse(value);
      },
      save: function(key2, value, options) {
        var cookieAttributes = {};
        if (window.location.protocol === "https:") {
          cookieAttributes = {
            secure: true,
            sameSite: "none"
          };
        }
        if (options === null || options === void 0 ? void 0 : options.daysUntilExpire) {
          cookieAttributes.expires = options.daysUntilExpire;
        }
        Cookies__namespace.set(key2, JSON.stringify(value), cookieAttributes);
      },
      remove: function(key2) {
        Cookies__namespace.remove(key2);
      }
    };
    var LEGACY_PREFIX = "_legacy_";
    var CookieStorageWithLegacySameSite = {
      get: function(key2) {
        var value = CookieStorage.get(key2);
        if (value) {
          return value;
        }
        return CookieStorage.get("".concat(LEGACY_PREFIX).concat(key2));
      },
      save: function(key2, value, options) {
        var cookieAttributes = {};
        if (window.location.protocol === "https:") {
          cookieAttributes = { secure: true };
        }
        if (options === null || options === void 0 ? void 0 : options.daysUntilExpire) {
          cookieAttributes.expires = options.daysUntilExpire;
        }
        Cookies__namespace.set("".concat(LEGACY_PREFIX).concat(key2), JSON.stringify(value), cookieAttributes);
        CookieStorage.save(key2, value, options);
      },
      remove: function(key2) {
        CookieStorage.remove(key2);
        CookieStorage.remove("".concat(LEGACY_PREFIX).concat(key2));
      }
    };
    var SessionStorage = {
      get: function(key2) {
        if (typeof sessionStorage === "undefined") {
          return;
        }
        var value = sessionStorage.getItem(key2);
        if (typeof value === "undefined") {
          return;
        }
        return JSON.parse(value);
      },
      save: function(key2, value) {
        sessionStorage.setItem(key2, JSON.stringify(value));
      },
      remove: function(key2) {
        sessionStorage.removeItem(key2);
      }
    };
    function decodeBase64(base642, enableUnicode) {
      var binaryString = atob(base642);
      if (enableUnicode) {
        var binaryView = new Uint8Array(binaryString.length);
        for (var i2 = 0, n = binaryString.length; i2 < n; ++i2) {
          binaryView[i2] = binaryString.charCodeAt(i2);
        }
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
      }
      return binaryString;
    }
    function createURL(base642, sourcemapArg, enableUnicodeArg) {
      var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
      var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
      var source = decodeBase64(base642, enableUnicode);
      var start = source.indexOf("\n", 10) + 1;
      var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
      var blob = new Blob([body], { type: "application/javascript" });
      return URL.createObjectURL(blob);
    }
    function createBase64WorkerFactory(base642, sourcemapArg, enableUnicodeArg) {
      var url;
      return function WorkerFactory2(options) {
        url = url || createURL(base642, sourcemapArg, enableUnicodeArg);
        return new Worker(url, options);
      };
    }
    var WorkerFactory = createBase64WorkerFactory("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLg0KDQogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55DQogICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLg0KDQogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgNCiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkNCiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsDQogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NDQogICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1INCiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SDQogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4NCiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqLw0KDQogICAgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7DQogICAgICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7DQogICAgICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHsNCiAgICAgICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldOw0KICAgICAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07DQogICAgICAgICAgICB9DQogICAgICAgICAgICByZXR1cm4gdDsNCiAgICAgICAgfTsNCiAgICAgICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7DQogICAgfTsNCg0KICAgIGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHsNCiAgICAgICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9DQogICAgICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgew0KICAgICAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfQ0KICAgICAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbInRocm93Il0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfQ0KICAgICAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH0NCiAgICAgICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTsNCiAgICAgICAgfSk7DQogICAgfQ0KDQogICAgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkgew0KICAgICAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnOw0KICAgICAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgInRocm93IjogdmVyYigxKSwgInJldHVybiI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gImZ1bmN0aW9uIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZzsNCiAgICAgICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9DQogICAgICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHsNCiAgICAgICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuIik7DQogICAgICAgICAgICB3aGlsZSAoXykgdHJ5IHsNCiAgICAgICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5WyJyZXR1cm4iXSA6IG9wWzBdID8geVsidGhyb3ciXSB8fCAoKHQgPSB5WyJyZXR1cm4iXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7DQogICAgICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdOw0KICAgICAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHsNCiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7DQogICAgICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07DQogICAgICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTsNCiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlOw0KICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Og0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7DQogICAgICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTsNCiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH0NCiAgICAgICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9Ow0KICAgICAgICB9DQogICAgfQ0KDQogICAgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHsNCiAgICAgICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSAiZnVuY3Rpb24iICYmIG9bU3ltYm9sLml0ZXJhdG9yXTsNCiAgICAgICAgaWYgKCFtKSByZXR1cm4gbzsNCiAgICAgICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7DQogICAgICAgIHRyeSB7DQogICAgICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTsNCiAgICAgICAgfQ0KICAgICAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH0NCiAgICAgICAgZmluYWxseSB7DQogICAgICAgICAgICB0cnkgew0KICAgICAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpWyJyZXR1cm4iXSkpIG0uY2FsbChpKTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfQ0KICAgICAgICB9DQogICAgICAgIHJldHVybiBhcjsNCiAgICB9CgogICAgLyoqDQogICAgICogQGlnbm9yZQ0KICAgICAqLw0KICAgIHZhciBNSVNTSU5HX1JFRlJFU0hfVE9LRU5fRVJST1JfTUVTU0FHRSA9ICdUaGUgd2ViIHdvcmtlciBpcyBtaXNzaW5nIHRoZSByZWZyZXNoIHRva2VuJzsKCiAgICB2YXIgcmVmcmVzaFRva2VucyA9IHt9Ow0KICAgIHZhciBjYWNoZUtleSA9IGZ1bmN0aW9uIChhdWRpZW5jZSwgc2NvcGUpIHsgcmV0dXJuICIiLmNvbmNhdChhdWRpZW5jZSwgInwiKS5jb25jYXQoc2NvcGUpOyB9Ow0KICAgIHZhciBnZXRSZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAoYXVkaWVuY2UsIHNjb3BlKSB7DQogICAgICAgIHJldHVybiByZWZyZXNoVG9rZW5zW2NhY2hlS2V5KGF1ZGllbmNlLCBzY29wZSldOw0KICAgIH07DQogICAgdmFyIHNldFJlZnJlc2hUb2tlbiA9IGZ1bmN0aW9uIChyZWZyZXNoVG9rZW4sIGF1ZGllbmNlLCBzY29wZSkgeyByZXR1cm4gKHJlZnJlc2hUb2tlbnNbY2FjaGVLZXkoYXVkaWVuY2UsIHNjb3BlKV0gPSByZWZyZXNoVG9rZW4pOyB9Ow0KICAgIHZhciBkZWxldGVSZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAoYXVkaWVuY2UsIHNjb3BlKSB7DQogICAgICAgIHJldHVybiBkZWxldGUgcmVmcmVzaFRva2Vuc1tjYWNoZUtleShhdWRpZW5jZSwgc2NvcGUpXTsNCiAgICB9Ow0KICAgIHZhciB3YWl0ID0gZnVuY3Rpb24gKHRpbWUpIHsNCiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJldHVybiBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUpOyB9KTsNCiAgICB9Ow0KICAgIHZhciBmb3JtRGF0YVRvT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1EYXRhKSB7DQogICAgICAgIHZhciBxdWVyeVBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZm9ybURhdGEpOw0KICAgICAgICB2YXIgcGFyc2VkUXVlcnkgPSB7fTsNCiAgICAgICAgcXVlcnlQYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAodmFsLCBrZXkpIHsNCiAgICAgICAgICAgIHBhcnNlZFF1ZXJ5W2tleV0gPSB2YWw7DQogICAgICAgIH0pOw0KICAgICAgICByZXR1cm4gcGFyc2VkUXVlcnk7DQogICAgfTsNCiAgICB2YXIgbWVzc2FnZUhhbmRsZXIgPSBmdW5jdGlvbiAoX2EpIHsNCiAgICAgICAgdmFyIF9iID0gX2EuZGF0YSwgdGltZW91dCA9IF9iLnRpbWVvdXQsIGF1dGggPSBfYi5hdXRoLCBmZXRjaFVybCA9IF9iLmZldGNoVXJsLCBmZXRjaE9wdGlvbnMgPSBfYi5mZXRjaE9wdGlvbnMsIHVzZUZvcm1EYXRhID0gX2IudXNlRm9ybURhdGEsIF9jID0gX19yZWFkKF9hLnBvcnRzLCAxKSwgcG9ydCA9IF9jWzBdOw0KICAgICAgICByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHsNCiAgICAgICAgICAgIHZhciBqc29uLCBfZCwgYXVkaWVuY2UsIHNjb3BlLCBib2R5LCByZWZyZXNoVG9rZW4sIGFib3J0Q29udHJvbGxlciwgcmVzcG9uc2UsIGVycm9yXzEsIGVycm9yXzI7DQogICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7DQogICAgICAgICAgICAgICAgc3dpdGNoIChfZS5sYWJlbCkgew0KICAgICAgICAgICAgICAgICAgICBjYXNlIDA6DQogICAgICAgICAgICAgICAgICAgICAgICBfZCA9IGF1dGggfHwge30sIGF1ZGllbmNlID0gX2QuYXVkaWVuY2UsIHNjb3BlID0gX2Quc2NvcGU7DQogICAgICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDE7DQogICAgICAgICAgICAgICAgICAgIGNhc2UgMToNCiAgICAgICAgICAgICAgICAgICAgICAgIF9lLnRyeXMucHVzaChbMSwgNywgLCA4XSk7DQogICAgICAgICAgICAgICAgICAgICAgICBib2R5ID0gdXNlRm9ybURhdGENCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGZvcm1EYXRhVG9PYmplY3QoZmV0Y2hPcHRpb25zLmJvZHkpDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBKU09OLnBhcnNlKGZldGNoT3B0aW9ucy5ib2R5KTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYm9keS5yZWZyZXNoX3Rva2VuICYmIGJvZHkuZ3JhbnRfdHlwZSA9PT0gJ3JlZnJlc2hfdG9rZW4nKSB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuID0gZ2V0UmVmcmVzaFRva2VuKGF1ZGllbmNlLCBzY29wZSk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4pIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKE1JU1NJTkdfUkVGUkVTSF9UT0tFTl9FUlJPUl9NRVNTQUdFKTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSB1c2VGb3JtRGF0YQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyBVUkxTZWFyY2hQYXJhbXMoX19hc3NpZ24oX19hc3NpZ24oe30sIGJvZHkpLCB7IHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbiB9KSkudG9TdHJpbmcoKQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KF9fYXNzaWduKF9fYXNzaWduKHt9LCBib2R5KSwgeyByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4gfSkpOw0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyID0gdm9pZCAwOw0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBBYm9ydENvbnRyb2xsZXIgPT09ICdmdW5jdGlvbicpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGFib3J0Q29udHJvbGxlci5zaWduYWw7DQogICAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHZvaWQgMDsNCiAgICAgICAgICAgICAgICAgICAgICAgIF9lLmxhYmVsID0gMjsNCiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOg0KICAgICAgICAgICAgICAgICAgICAgICAgX2UudHJ5cy5wdXNoKFsyLCA0LCAsIDVdKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIFByb21pc2UucmFjZShbDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhaXQodGltZW91dCksDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoKGZldGNoVXJsLCBfX2Fzc2lnbih7fSwgZmV0Y2hPcHRpb25zKSkNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKV07DQogICAgICAgICAgICAgICAgICAgIGNhc2UgMzoNCiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX2Uuc2VudCgpOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07DQogICAgICAgICAgICAgICAgICAgIGNhc2UgNDoNCiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfZS5zZW50KCk7DQogICAgICAgICAgICAgICAgICAgICAgICAvLyBmZXRjaCBlcnJvciwgcmVqZWN0IGBzZW5kTWVzc2FnZWAgdXNpbmcgYGVycm9yYCBrZXkgc28gdGhhdCB3ZSByZXRyeS4NCiAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcl8xLm1lc3NhZ2UNCiAgICAgICAgICAgICAgICAgICAgICAgIH0pOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dOw0KICAgICAgICAgICAgICAgICAgICBjYXNlIDU6DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgdGltZXMgb3V0LCBhYm9ydCBpdCBhbmQgbGV0IGBzd2l0Y2hGZXRjaGAgcmFpc2UgdGhlIGVycm9yLg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhYm9ydENvbnRyb2xsZXIpDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0Q29udHJvbGxlci5hYm9ydCgpOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogIlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyINCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107DQogICAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCByZXNwb25zZS5qc29uKCldOw0KICAgICAgICAgICAgICAgICAgICBjYXNlIDY6DQogICAgICAgICAgICAgICAgICAgICAgICBqc29uID0gX2Uuc2VudCgpOw0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24ucmVmcmVzaF90b2tlbikgew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlZnJlc2hUb2tlbihqc29uLnJlZnJlc2hfdG9rZW4sIGF1ZGllbmNlLCBzY29wZSk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGpzb24ucmVmcmVzaF90b2tlbjsNCiAgICAgICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Ugew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZVJlZnJlc2hUb2tlbihhdWRpZW5jZSwgc2NvcGUpOw0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgb2s6IHJlc3BvbnNlLm9rLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IGpzb24NCiAgICAgICAgICAgICAgICAgICAgICAgIH0pOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgOF07DQogICAgICAgICAgICAgICAgICAgIGNhc2UgNzoNCiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzIgPSBfZS5zZW50KCk7DQogICAgICAgICAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvazogZmFsc2UsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbjogew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9kZXNjcmlwdGlvbjogZXJyb3JfMi5tZXNzYWdlDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgfSk7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA4XTsNCiAgICAgICAgICAgICAgICAgICAgY2FzZSA4OiByZXR1cm4gWzIgLypyZXR1cm4qL107DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfSk7DQogICAgICAgIH0pOw0KICAgIH07DQogICAgLy8gRG9uJ3QgcnVuIGBhZGRFdmVudExpc3RlbmVyYCBpbiBvdXIgdGVzdHMgKHRoaXMgaXMgcmVwbGFjZWQgaW4gcm9sbHVwKQ0KICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICAqLw0KICAgIHsNCiAgICAgICAgLy8gQHRzLWlnbm9yZQ0KICAgICAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbWVzc2FnZUhhbmRsZXIpOw0KICAgIH0KCn0pKCk7Cgo=", null, false);
    var isIE11 = function() {
      return /Trident.*rv:11\.0/.test(navigator.userAgent);
    };
    var singlePromiseMap = {};
    var singlePromise = function(cb, key2) {
      var promise = singlePromiseMap[key2];
      if (!promise) {
        promise = cb().finally(function() {
          delete singlePromiseMap[key2];
          promise = null;
        });
        singlePromiseMap[key2] = promise;
      }
      return promise;
    };
    var retryPromise = function(cb, maxNumberOfRetries) {
      if (maxNumberOfRetries === void 0) {
        maxNumberOfRetries = 3;
      }
      return __awaiter(void 0, void 0, void 0, function() {
        var i2;
        return __generator(this, function(_a4) {
          switch (_a4.label) {
            case 0:
              i2 = 0;
              _a4.label = 1;
            case 1:
              if (!(i2 < maxNumberOfRetries))
                return [3, 4];
              return [4, cb()];
            case 2:
              if (_a4.sent()) {
                return [2, true];
              }
              _a4.label = 3;
            case 3:
              i2++;
              return [3, 1];
            case 4:
              return [2, false];
          }
        });
      });
    };
    var CacheKeyManifest = function() {
      function CacheKeyManifest2(cache, clientId) {
        this.cache = cache;
        this.clientId = clientId;
        this.manifestKey = this.createManifestKeyFrom(this.clientId);
      }
      CacheKeyManifest2.prototype.add = function(key2) {
        var _a4;
        return __awaiter(this, void 0, void 0, function() {
          var keys2, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
              case 0:
                _b = Set.bind;
                return [4, this.cache.get(this.manifestKey)];
              case 1:
                keys2 = new (_b.apply(Set, [void 0, ((_a4 = _c.sent()) === null || _a4 === void 0 ? void 0 : _a4.keys) || []]))();
                keys2.add(key2);
                return [4, this.cache.set(this.manifestKey, {
                  keys: __spreadArray([], __read(keys2), false)
                })];
              case 2:
                _c.sent();
                return [2];
            }
          });
        });
      };
      CacheKeyManifest2.prototype.remove = function(key2) {
        return __awaiter(this, void 0, void 0, function() {
          var entry4, keys2;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, this.cache.get(this.manifestKey)];
              case 1:
                entry4 = _a4.sent();
                if (!entry4)
                  return [3, 5];
                keys2 = new Set(entry4.keys);
                keys2.delete(key2);
                if (!(keys2.size > 0))
                  return [3, 3];
                return [4, this.cache.set(this.manifestKey, { keys: __spreadArray([], __read(keys2), false) })];
              case 2:
                return [2, _a4.sent()];
              case 3:
                return [4, this.cache.remove(this.manifestKey)];
              case 4:
                return [2, _a4.sent()];
              case 5:
                return [2];
            }
          });
        });
      };
      CacheKeyManifest2.prototype.get = function() {
        return this.cache.get(this.manifestKey);
      };
      CacheKeyManifest2.prototype.clear = function() {
        return this.cache.remove(this.manifestKey);
      };
      CacheKeyManifest2.prototype.createManifestKeyFrom = function(clientId) {
        return "".concat(CACHE_KEY_PREFIX, "::").concat(clientId);
      };
      return CacheKeyManifest2;
    }();
    var lock = new Lock__default["default"]();
    var GET_TOKEN_SILENTLY_LOCK_KEY = "auth0.lock.getTokenSilently";
    var buildOrganizationHintCookieName = function(clientId) {
      return "auth0.".concat(clientId, ".organization_hint");
    };
    var OLD_IS_AUTHENTICATED_COOKIE_NAME = "auth0.is.authenticated";
    var buildIsAuthenticatedCookieName = function(clientId) {
      return "auth0.".concat(clientId, ".is.authenticated");
    };
    var cacheLocationBuilders = {
      memory: function() {
        return new InMemoryCache().enclosedCache;
      },
      localstorage: function() {
        return new LocalStorageCache();
      }
    };
    var cacheFactory = function(location) {
      return cacheLocationBuilders[location];
    };
    var supportWebWorker = function() {
      return !isIE11();
    };
    var getTokenIssuer = function(issuer, domainUrl) {
      if (issuer) {
        return issuer.startsWith("https://") ? issuer : "https://".concat(issuer, "/");
      }
      return "".concat(domainUrl, "/");
    };
    var getDomain = function(domainUrl) {
      if (!/^https?:\/\//.test(domainUrl)) {
        return "https://".concat(domainUrl);
      }
      return domainUrl;
    };
    var getCustomInitialOptions = function(options) {
      options.advancedOptions;
      options.audience;
      options.auth0Client;
      options.authorizeTimeoutInSeconds;
      options.cacheLocation;
      options.client_id;
      options.domain;
      options.issuer;
      options.leeway;
      options.max_age;
      options.redirect_uri;
      options.scope;
      options.useRefreshTokens;
      options.useCookiesForTransactions;
      options.useFormData;
      var customParams = __rest(options, ["advancedOptions", "audience", "auth0Client", "authorizeTimeoutInSeconds", "cacheLocation", "client_id", "domain", "issuer", "leeway", "max_age", "redirect_uri", "scope", "useRefreshTokens", "useCookiesForTransactions", "useFormData"]);
      return customParams;
    };
    var Auth0Client = function() {
      function Auth0Client2(options) {
        var _a4, _b;
        this.options = options;
        typeof window !== "undefined" && validateCrypto();
        if (options.cache && options.cacheLocation) {
          console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`.");
        }
        var cache;
        if (options.cache) {
          cache = options.cache;
        } else {
          this.cacheLocation = options.cacheLocation || CACHE_LOCATION_MEMORY;
          if (!cacheFactory(this.cacheLocation)) {
            throw new Error('Invalid cache location "'.concat(this.cacheLocation, '"'));
          }
          cache = cacheFactory(this.cacheLocation)();
        }
        this.httpTimeoutMs = options.httpTimeoutInSeconds ? options.httpTimeoutInSeconds * 1e3 : DEFAULT_FETCH_TIMEOUT_MS;
        this.cookieStorage = options.legacySameSiteCookie === false ? CookieStorage : CookieStorageWithLegacySameSite;
        this.orgHintCookieName = buildOrganizationHintCookieName(this.options.client_id);
        this.isAuthenticatedCookieName = buildIsAuthenticatedCookieName(this.options.client_id);
        this.sessionCheckExpiryDays = options.sessionCheckExpiryDays || DEFAULT_SESSION_CHECK_EXPIRY_DAYS;
        var transactionStorage = options.useCookiesForTransactions ? this.cookieStorage : SessionStorage;
        this.scope = this.options.scope;
        this.transactionManager = new TransactionManager(transactionStorage, this.options.client_id);
        this.nowProvider = this.options.nowProvider || DEFAULT_NOW_PROVIDER;
        this.cacheManager = new CacheManager(cache, !cache.allKeys ? new CacheKeyManifest(cache, this.options.client_id) : null, this.nowProvider);
        this.domainUrl = getDomain(this.options.domain);
        this.tokenIssuer = getTokenIssuer(this.options.issuer, this.domainUrl);
        this.defaultScope = getUniqueScopes("openid", ((_b = (_a4 = this.options) === null || _a4 === void 0 ? void 0 : _a4.advancedOptions) === null || _b === void 0 ? void 0 : _b.defaultScope) !== void 0 ? this.options.advancedOptions.defaultScope : DEFAULT_SCOPE);
        if (this.options.useRefreshTokens) {
          this.scope = getUniqueScopes(this.scope, "offline_access");
        }
        if (typeof window !== "undefined" && window.Worker && this.options.useRefreshTokens && this.cacheLocation === CACHE_LOCATION_MEMORY && supportWebWorker()) {
          this.worker = new WorkerFactory();
        }
        this.customOptions = getCustomInitialOptions(options);
      }
      Auth0Client2.prototype._url = function(path2) {
        var auth0Client = encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client || DEFAULT_AUTH0_CLIENT)));
        return "".concat(this.domainUrl).concat(path2, "&auth0Client=").concat(auth0Client);
      };
      Auth0Client2.prototype._getParams = function(authorizeOptions, state, nonce, code_challenge, redirect_uri) {
        var _a4 = this.options;
        _a4.useRefreshTokens;
        _a4.useCookiesForTransactions;
        _a4.useFormData;
        _a4.auth0Client;
        _a4.cacheLocation;
        _a4.advancedOptions;
        _a4.detailedResponse;
        _a4.nowProvider;
        _a4.authorizeTimeoutInSeconds;
        _a4.legacySameSiteCookie;
        _a4.sessionCheckExpiryDays;
        _a4.domain;
        _a4.leeway;
        _a4.httpTimeoutInSeconds;
        var loginOptions = __rest(_a4, ["useRefreshTokens", "useCookiesForTransactions", "useFormData", "auth0Client", "cacheLocation", "advancedOptions", "detailedResponse", "nowProvider", "authorizeTimeoutInSeconds", "legacySameSiteCookie", "sessionCheckExpiryDays", "domain", "leeway", "httpTimeoutInSeconds"]);
        return __assign(__assign(__assign({}, loginOptions), authorizeOptions), { scope: getUniqueScopes(this.defaultScope, this.scope, authorizeOptions.scope), response_type: "code", response_mode: "query", state, nonce, redirect_uri: redirect_uri || this.options.redirect_uri, code_challenge, code_challenge_method: "S256" });
      };
      Auth0Client2.prototype._authorizeUrl = function(authorizeOptions) {
        return this._url("/authorize?".concat(createQueryParams(authorizeOptions)));
      };
      Auth0Client2.prototype._verifyIdToken = function(id_token, nonce, organizationId) {
        return __awaiter(this, void 0, void 0, function() {
          var now;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, this.nowProvider()];
              case 1:
                now = _a4.sent();
                return [2, verify({
                  iss: this.tokenIssuer,
                  aud: this.options.client_id,
                  id_token,
                  nonce,
                  organizationId,
                  leeway: this.options.leeway,
                  max_age: this._parseNumber(this.options.max_age),
                  now
                })];
            }
          });
        });
      };
      Auth0Client2.prototype._parseNumber = function(value) {
        if (typeof value !== "string") {
          return value;
        }
        return parseInt(value, 10) || void 0;
      };
      Auth0Client2.prototype._processOrgIdHint = function(organizationId) {
        if (organizationId) {
          this.cookieStorage.save(this.orgHintCookieName, organizationId, {
            daysUntilExpire: this.sessionCheckExpiryDays
          });
        } else {
          this.cookieStorage.remove(this.orgHintCookieName);
        }
      };
      Auth0Client2.prototype.buildAuthorizeUrl = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var redirect_uri, appState, authorizeOptions, stateIn, nonceIn, code_verifier, code_challengeBuffer, code_challenge, fragment, params, url, organizationId;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                redirect_uri = options.redirect_uri, appState = options.appState, authorizeOptions = __rest(options, ["redirect_uri", "appState"]);
                stateIn = encode2(createRandomString());
                nonceIn = encode2(createRandomString());
                code_verifier = createRandomString();
                return [4, sha2562(code_verifier)];
              case 1:
                code_challengeBuffer = _a4.sent();
                code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
                fragment = options.fragment ? "#".concat(options.fragment) : "";
                params = this._getParams(authorizeOptions, stateIn, nonceIn, code_challenge, redirect_uri);
                url = this._authorizeUrl(params);
                organizationId = options.organization || this.options.organization;
                this.transactionManager.create(__assign({ nonce: nonceIn, code_verifier, appState, scope: params.scope, audience: params.audience || "default", redirect_uri: params.redirect_uri, state: stateIn }, organizationId && { organizationId }));
                return [2, url + fragment];
            }
          });
        });
      };
      Auth0Client2.prototype.loginWithPopup = function(options, config) {
        return __awaiter(this, void 0, void 0, function() {
          var authorizeOptions, stateIn, nonceIn, code_verifier, code_challengeBuffer, code_challenge, params, url, codeResult, authResult, organizationId, decodedToken, cacheEntry;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                options = options || {};
                config = config || {};
                if (!config.popup) {
                  config.popup = openPopup("");
                }
                authorizeOptions = __rest(options, []);
                stateIn = encode2(createRandomString());
                nonceIn = encode2(createRandomString());
                code_verifier = createRandomString();
                return [4, sha2562(code_verifier)];
              case 1:
                code_challengeBuffer = _a4.sent();
                code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
                params = this._getParams(authorizeOptions, stateIn, nonceIn, code_challenge, this.options.redirect_uri || window.location.origin);
                url = this._authorizeUrl(__assign(__assign({}, params), { response_mode: "web_message" }));
                config.popup.location.href = url;
                return [4, runPopup(__assign(__assign({}, config), { timeoutInSeconds: config.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS }))];
              case 2:
                codeResult = _a4.sent();
                if (stateIn !== codeResult.state) {
                  throw new Error("Invalid state");
                }
                return [4, oauthToken({
                  audience: params.audience,
                  scope: params.scope,
                  baseUrl: this.domainUrl,
                  client_id: this.options.client_id,
                  code_verifier,
                  code: codeResult.code,
                  grant_type: "authorization_code",
                  redirect_uri: params.redirect_uri,
                  auth0Client: this.options.auth0Client,
                  useFormData: this.options.useFormData,
                  timeout: this.httpTimeoutMs
                }, this.worker)];
              case 3:
                authResult = _a4.sent();
                organizationId = options.organization || this.options.organization;
                return [4, this._verifyIdToken(authResult.id_token, nonceIn, organizationId)];
              case 4:
                decodedToken = _a4.sent();
                cacheEntry = __assign(__assign({}, authResult), { decodedToken, scope: params.scope, audience: params.audience || "default", client_id: this.options.client_id });
                return [4, this.cacheManager.set(cacheEntry)];
              case 5:
                _a4.sent();
                this.cookieStorage.save(this.isAuthenticatedCookieName, true, {
                  daysUntilExpire: this.sessionCheckExpiryDays
                });
                this._processOrgIdHint(decodedToken.claims.org_id);
                return [2];
            }
          });
        });
      };
      Auth0Client2.prototype.getUser = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var audience, scope, cache;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                audience = options.audience || this.options.audience || "default";
                scope = getUniqueScopes(this.defaultScope, this.scope, options.scope);
                return [4, this.cacheManager.get(new CacheKey({
                  client_id: this.options.client_id,
                  audience,
                  scope
                }))];
              case 1:
                cache = _a4.sent();
                return [2, cache && cache.decodedToken && cache.decodedToken.user];
            }
          });
        });
      };
      Auth0Client2.prototype.getIdTokenClaims = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var audience, scope, cache;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                audience = options.audience || this.options.audience || "default";
                scope = getUniqueScopes(this.defaultScope, this.scope, options.scope);
                return [4, this.cacheManager.get(new CacheKey({
                  client_id: this.options.client_id,
                  audience,
                  scope
                }))];
              case 1:
                cache = _a4.sent();
                return [2, cache && cache.decodedToken && cache.decodedToken.claims];
            }
          });
        });
      };
      Auth0Client2.prototype.loginWithRedirect = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var redirectMethod, urlOptions, url;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                redirectMethod = options.redirectMethod, urlOptions = __rest(options, ["redirectMethod"]);
                return [4, this.buildAuthorizeUrl(urlOptions)];
              case 1:
                url = _a4.sent();
                window.location[redirectMethod || "assign"](url);
                return [2];
            }
          });
        });
      };
      Auth0Client2.prototype.handleRedirectCallback = function(url) {
        if (url === void 0) {
          url = window.location.href;
        }
        return __awaiter(this, void 0, void 0, function() {
          var queryStringFragments, _a4, state, code, error2, error_description, transaction, tokenOptions, authResult, decodedToken;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                queryStringFragments = url.split("?").slice(1);
                if (queryStringFragments.length === 0) {
                  throw new Error("There are no query params available for parsing.");
                }
                _a4 = parseQueryResult(queryStringFragments.join("")), state = _a4.state, code = _a4.code, error2 = _a4.error, error_description = _a4.error_description;
                transaction = this.transactionManager.get();
                if (!transaction) {
                  throw new Error("Invalid state");
                }
                this.transactionManager.remove();
                if (error2) {
                  throw new AuthenticationError(error2, error_description, state, transaction.appState);
                }
                if (!transaction.code_verifier || transaction.state && transaction.state !== state) {
                  throw new Error("Invalid state");
                }
                tokenOptions = {
                  audience: transaction.audience,
                  scope: transaction.scope,
                  baseUrl: this.domainUrl,
                  client_id: this.options.client_id,
                  code_verifier: transaction.code_verifier,
                  grant_type: "authorization_code",
                  code,
                  auth0Client: this.options.auth0Client,
                  useFormData: this.options.useFormData,
                  timeout: this.httpTimeoutMs
                };
                if (transaction.redirect_uri !== void 0) {
                  tokenOptions.redirect_uri = transaction.redirect_uri;
                }
                return [4, oauthToken(tokenOptions, this.worker)];
              case 1:
                authResult = _b.sent();
                return [4, this._verifyIdToken(authResult.id_token, transaction.nonce, transaction.organizationId)];
              case 2:
                decodedToken = _b.sent();
                return [4, this.cacheManager.set(__assign(__assign(__assign(__assign({}, authResult), { decodedToken, audience: transaction.audience, scope: transaction.scope }), authResult.scope ? { oauthTokenScope: authResult.scope } : null), { client_id: this.options.client_id }))];
              case 3:
                _b.sent();
                this.cookieStorage.save(this.isAuthenticatedCookieName, true, {
                  daysUntilExpire: this.sessionCheckExpiryDays
                });
                this._processOrgIdHint(decodedToken.claims.org_id);
                return [2, {
                  appState: transaction.appState
                }];
            }
          });
        });
      };
      Auth0Client2.prototype.checkSession = function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var error_1;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
                  if (!this.cookieStorage.get(OLD_IS_AUTHENTICATED_COOKIE_NAME)) {
                    return [2];
                  } else {
                    this.cookieStorage.save(this.isAuthenticatedCookieName, true, {
                      daysUntilExpire: this.sessionCheckExpiryDays
                    });
                    this.cookieStorage.remove(OLD_IS_AUTHENTICATED_COOKIE_NAME);
                  }
                }
                _a4.label = 1;
              case 1:
                _a4.trys.push([1, 3, , 4]);
                return [4, this.getTokenSilently(options)];
              case 2:
                _a4.sent();
                return [3, 4];
              case 3:
                error_1 = _a4.sent();
                if (!RECOVERABLE_ERRORS.includes(error_1.error)) {
                  throw error_1;
                }
                return [3, 4];
              case 4:
                return [2];
            }
          });
        });
      };
      Auth0Client2.prototype.getTokenSilently = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var _a4, ignoreCache, getTokenOptions;
          var _this = this;
          return __generator(this, function(_b) {
            _a4 = __assign(__assign({ audience: this.options.audience, ignoreCache: false }, options), { scope: getUniqueScopes(this.defaultScope, this.scope, options.scope) }), ignoreCache = _a4.ignoreCache, getTokenOptions = __rest(_a4, ["ignoreCache"]);
            return [2, singlePromise(function() {
              return _this._getTokenSilently(__assign({ ignoreCache }, getTokenOptions));
            }, "".concat(this.options.client_id, "::").concat(getTokenOptions.audience, "::").concat(getTokenOptions.scope))];
          });
        });
      };
      Auth0Client2.prototype._getTokenSilently = function(options) {
        if (options === void 0) {
          options = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var ignoreCache, getTokenOptions, entry4, entry4, authResult, _a4, id_token, access_token, oauthTokenScope, expires_in;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                ignoreCache = options.ignoreCache, getTokenOptions = __rest(options, ["ignoreCache"]);
                if (!!ignoreCache)
                  return [3, 2];
                return [4, this._getEntryFromCache({
                  scope: getTokenOptions.scope,
                  audience: getTokenOptions.audience || "default",
                  client_id: this.options.client_id,
                  getDetailedEntry: options.detailedResponse
                })];
              case 1:
                entry4 = _b.sent();
                if (entry4) {
                  return [2, entry4];
                }
                _b.label = 2;
              case 2:
                return [4, retryPromise(function() {
                  return lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5e3);
                }, 10)];
              case 3:
                if (!_b.sent())
                  return [3, 15];
                _b.label = 4;
              case 4:
                _b.trys.push([4, , 12, 14]);
                if (!!ignoreCache)
                  return [3, 6];
                return [4, this._getEntryFromCache({
                  scope: getTokenOptions.scope,
                  audience: getTokenOptions.audience || "default",
                  client_id: this.options.client_id,
                  getDetailedEntry: options.detailedResponse
                })];
              case 5:
                entry4 = _b.sent();
                if (entry4) {
                  return [2, entry4];
                }
                _b.label = 6;
              case 6:
                if (!this.options.useRefreshTokens)
                  return [3, 8];
                return [4, this._getTokenUsingRefreshToken(getTokenOptions)];
              case 7:
                _a4 = _b.sent();
                return [3, 10];
              case 8:
                return [4, this._getTokenFromIFrame(getTokenOptions)];
              case 9:
                _a4 = _b.sent();
                _b.label = 10;
              case 10:
                authResult = _a4;
                return [4, this.cacheManager.set(__assign({ client_id: this.options.client_id }, authResult))];
              case 11:
                _b.sent();
                this.cookieStorage.save(this.isAuthenticatedCookieName, true, {
                  daysUntilExpire: this.sessionCheckExpiryDays
                });
                if (options.detailedResponse) {
                  id_token = authResult.id_token, access_token = authResult.access_token, oauthTokenScope = authResult.oauthTokenScope, expires_in = authResult.expires_in;
                  return [2, __assign(__assign({ id_token, access_token }, oauthTokenScope ? { scope: oauthTokenScope } : null), { expires_in })];
                }
                return [2, authResult.access_token];
              case 12:
                return [4, lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY)];
              case 13:
                _b.sent();
                return [7];
              case 14:
                return [3, 16];
              case 15:
                throw new TimeoutError();
              case 16:
                return [2];
            }
          });
        });
      };
      Auth0Client2.prototype.getTokenWithPopup = function(options, config) {
        if (options === void 0) {
          options = {};
        }
        if (config === void 0) {
          config = {};
        }
        return __awaiter(this, void 0, void 0, function() {
          var cache;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                options.audience = options.audience || this.options.audience;
                options.scope = getUniqueScopes(this.defaultScope, this.scope, options.scope);
                config = __assign(__assign({}, DEFAULT_POPUP_CONFIG_OPTIONS), config);
                return [4, this.loginWithPopup(options, config)];
              case 1:
                _a4.sent();
                return [4, this.cacheManager.get(new CacheKey({
                  scope: options.scope,
                  audience: options.audience || "default",
                  client_id: this.options.client_id
                }))];
              case 2:
                cache = _a4.sent();
                return [2, cache.access_token];
            }
          });
        });
      };
      Auth0Client2.prototype.isAuthenticated = function() {
        return __awaiter(this, void 0, void 0, function() {
          var user2;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                return [4, this.getUser()];
              case 1:
                user2 = _a4.sent();
                return [2, !!user2];
            }
          });
        });
      };
      Auth0Client2.prototype.buildLogoutUrl = function(options) {
        if (options === void 0) {
          options = {};
        }
        if (options.client_id !== null) {
          options.client_id = options.client_id || this.options.client_id;
        } else {
          delete options.client_id;
        }
        var federated = options.federated, logoutOptions = __rest(options, ["federated"]);
        var federatedQuery = federated ? "&federated" : "";
        var url = this._url("/v2/logout?".concat(createQueryParams(logoutOptions)));
        return url + federatedQuery;
      };
      Auth0Client2.prototype.logout = function(options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        var localOnly = options.localOnly, logoutOptions = __rest(options, ["localOnly"]);
        if (localOnly && logoutOptions.federated) {
          throw new Error("It is invalid to set both the `federated` and `localOnly` options to `true`");
        }
        var postCacheClear = function() {
          _this.cookieStorage.remove(_this.orgHintCookieName);
          _this.cookieStorage.remove(_this.isAuthenticatedCookieName);
          if (localOnly) {
            return;
          }
          var url = _this.buildLogoutUrl(logoutOptions);
          window.location.assign(url);
        };
        if (this.options.cache) {
          return this.cacheManager.clear().then(function() {
            return postCacheClear();
          });
        } else {
          this.cacheManager.clearSync();
          postCacheClear();
        }
      };
      Auth0Client2.prototype._getTokenFromIFrame = function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var stateIn, nonceIn, code_verifier, code_challengeBuffer, code_challenge, withoutClientOptions, params, orgIdHint, url, authorizeTimeout, codeResult, scope, audience, customOptions, tokenResult, decodedToken, e_1;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                stateIn = encode2(createRandomString());
                nonceIn = encode2(createRandomString());
                code_verifier = createRandomString();
                return [4, sha2562(code_verifier)];
              case 1:
                code_challengeBuffer = _a4.sent();
                code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
                withoutClientOptions = __rest(options, ["detailedResponse"]);
                params = this._getParams(withoutClientOptions, stateIn, nonceIn, code_challenge, options.redirect_uri || this.options.redirect_uri || window.location.origin);
                orgIdHint = this.cookieStorage.get(this.orgHintCookieName);
                if (orgIdHint && !params.organization) {
                  params.organization = orgIdHint;
                }
                url = this._authorizeUrl(__assign(__assign({}, params), { prompt: "none", response_mode: "web_message" }));
                _a4.label = 2;
              case 2:
                _a4.trys.push([2, 6, , 7]);
                if (window.crossOriginIsolated) {
                  throw new GenericError("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
                }
                authorizeTimeout = options.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;
                return [4, runIframe(url, this.domainUrl, authorizeTimeout)];
              case 3:
                codeResult = _a4.sent();
                if (stateIn !== codeResult.state) {
                  throw new Error("Invalid state");
                }
                scope = options.scope, audience = options.audience, customOptions = __rest(options, ["scope", "audience", "redirect_uri", "ignoreCache", "timeoutInSeconds", "detailedResponse"]);
                return [4, oauthToken(__assign(__assign(__assign({}, this.customOptions), customOptions), { scope, audience, baseUrl: this.domainUrl, client_id: this.options.client_id, code_verifier, code: codeResult.code, grant_type: "authorization_code", redirect_uri: params.redirect_uri, auth0Client: this.options.auth0Client, useFormData: this.options.useFormData, timeout: customOptions.timeout || this.httpTimeoutMs }), this.worker)];
              case 4:
                tokenResult = _a4.sent();
                return [4, this._verifyIdToken(tokenResult.id_token, nonceIn)];
              case 5:
                decodedToken = _a4.sent();
                this._processOrgIdHint(decodedToken.claims.org_id);
                return [2, __assign(__assign({}, tokenResult), { decodedToken, scope: params.scope, oauthTokenScope: tokenResult.scope, audience: params.audience || "default" })];
              case 6:
                e_1 = _a4.sent();
                if (e_1.error === "login_required") {
                  this.logout({
                    localOnly: true
                  });
                }
                throw e_1;
              case 7:
                return [2];
            }
          });
        });
      };
      Auth0Client2.prototype._getTokenUsingRefreshToken = function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var cache, redirect_uri, tokenResult, scope, audience, customOptions, timeout, e_2, decodedToken;
          return __generator(this, function(_a4) {
            switch (_a4.label) {
              case 0:
                options.scope = getUniqueScopes(this.defaultScope, this.options.scope, options.scope);
                return [4, this.cacheManager.get(new CacheKey({
                  scope: options.scope,
                  audience: options.audience || "default",
                  client_id: this.options.client_id
                }))];
              case 1:
                cache = _a4.sent();
                if (!((!cache || !cache.refresh_token) && !this.worker))
                  return [3, 3];
                return [4, this._getTokenFromIFrame(options)];
              case 2:
                return [2, _a4.sent()];
              case 3:
                redirect_uri = options.redirect_uri || this.options.redirect_uri || window.location.origin;
                scope = options.scope, audience = options.audience, customOptions = __rest(options, ["scope", "audience", "ignoreCache", "timeoutInSeconds", "detailedResponse"]);
                timeout = typeof options.timeoutInSeconds === "number" ? options.timeoutInSeconds * 1e3 : null;
                _a4.label = 4;
              case 4:
                _a4.trys.push([4, 6, , 9]);
                return [4, oauthToken(__assign(__assign(__assign(__assign(__assign({}, this.customOptions), customOptions), { audience, scope, baseUrl: this.domainUrl, client_id: this.options.client_id, grant_type: "refresh_token", refresh_token: cache && cache.refresh_token, redirect_uri }), timeout && { timeout }), { auth0Client: this.options.auth0Client, useFormData: this.options.useFormData, timeout: this.httpTimeoutMs }), this.worker)];
              case 5:
                tokenResult = _a4.sent();
                return [3, 9];
              case 6:
                e_2 = _a4.sent();
                if (!(e_2.message === MISSING_REFRESH_TOKEN_ERROR_MESSAGE || e_2.message && e_2.message.indexOf(INVALID_REFRESH_TOKEN_ERROR_MESSAGE) > -1))
                  return [3, 8];
                return [4, this._getTokenFromIFrame(options)];
              case 7:
                return [2, _a4.sent()];
              case 8:
                throw e_2;
              case 9:
                return [4, this._verifyIdToken(tokenResult.id_token)];
              case 10:
                decodedToken = _a4.sent();
                return [2, __assign(__assign({}, tokenResult), { decodedToken, scope: options.scope, oauthTokenScope: tokenResult.scope, audience: options.audience || "default" })];
            }
          });
        });
      };
      Auth0Client2.prototype._getEntryFromCache = function(_a4) {
        var scope = _a4.scope, audience = _a4.audience, client_id = _a4.client_id, _b = _a4.getDetailedEntry, getDetailedEntry = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function() {
          var entry4, id_token, access_token, oauthTokenScope, expires_in;
          return __generator(this, function(_c) {
            switch (_c.label) {
              case 0:
                return [4, this.cacheManager.get(new CacheKey({
                  scope,
                  audience,
                  client_id
                }), 60)];
              case 1:
                entry4 = _c.sent();
                if (entry4 && entry4.access_token) {
                  if (getDetailedEntry) {
                    id_token = entry4.id_token, access_token = entry4.access_token, oauthTokenScope = entry4.oauthTokenScope, expires_in = entry4.expires_in;
                    return [2, __assign(__assign({ id_token, access_token }, oauthTokenScope ? { scope: oauthTokenScope } : null), { expires_in })];
                  }
                  return [2, entry4.access_token];
                }
                return [2];
            }
          });
        });
      };
      return Auth0Client2;
    }();
    function createAuth0Client(options) {
      return __awaiter(this, void 0, void 0, function() {
        var auth0;
        return __generator(this, function(_a4) {
          switch (_a4.label) {
            case 0:
              auth0 = new Auth0Client(options);
              return [4, auth0.checkSession()];
            case 1:
              _a4.sent();
              return [2, auth0];
          }
        });
      });
    }
    var wrapper = createAuth0Client;
    wrapper.Auth0Client = Auth0Client;
    wrapper.createAuth0Client = createAuth0Client;
    wrapper.GenericError = GenericError;
    wrapper.AuthenticationError = AuthenticationError;
    wrapper.TimeoutError = TimeoutError;
    wrapper.PopupTimeoutError = PopupTimeoutError;
    wrapper.MfaRequiredError = MfaRequiredError;
    module2.exports = wrapper;
  }
});

// .svelte-kit/output/server/entries/pages/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Routes
});
function writable2(value, start = noop2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue2.length; i2 += 2) {
            subscriber_queue2[i2][0](subscriber_queue2[i2 + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var import_auth0_spa_js, subscriber_queue2, isAuthenticated, user, Routes;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
    init_index_08869495();
    import_auth0_spa_js = __toESM(require_auth0_spa_js_cjs(), 1);
    subscriber_queue2 = [];
    isAuthenticated = writable2(false);
    user = writable2({});
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $user, $$unsubscribe_user;
      let $isAuthenticated, $$unsubscribe_isAuthenticated;
      $$unsubscribe_user = subscribe(user, (value) => $user = value);
      $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
      let t2;
      {
        if ($isAuthenticated) {
          console.log($user);
        }
      }
      $$unsubscribe_user();
      $$unsubscribe_isAuthenticated();
      return `<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="${"https://kit.svelte.dev"}">kit.svelte.dev</a> to read the
  documentation
</p>

${$isAuthenticated ? `${$user.name == "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0420\u0443\u0434\u0438\u043D" ? `<h2>dd ${escape(t2)}</h2>` : ``}
  <h2>Hey ${escape($user.name)} !</h2>
  ${$user.picture ? `<img${add_attribute("src", $user.picture, 0)}${add_attribute("alt", user.name, 0)}>` : `<img src="${"https://source.unsplash.com/random/400x300"}" alt="${"Random Photo"}">`}
  <button>Logout</button>` : `<button>Login</button>`}`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  css: () => css3,
  entry: () => entry3,
  js: () => js3,
  module: () => index_svelte_exports
});
var entry3, js3, css3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_index_svelte();
    entry3 = "pages/index.svelte-db78d9b0.js";
    js3 = ["pages/index.svelte-db78d9b0.js", "chunks/vendor-1b4702e0.js"];
    css3 = [];
  }
});

// .svelte-kit/vercel-tmp/entry.js
var entry_exports = {};
__export(entry_exports, {
  default: () => entry_default
});

// .svelte-kit/vercel-tmp/shims.js
init_install_fetch();
__fetch_polyfill();

// node_modules/@sveltejs/kit/dist/node.js
var import_stream = require("stream");
function get_raw_body(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
async function getRequest(base2, req) {
  let headers = req.headers;
  if (req.httpVersionMajor === 2) {
    headers = Object.assign({}, headers);
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":authority"];
    delete headers[":scheme"];
  }
  return new Request(base2 + req.url, {
    method: req.method,
    headers,
    body: await get_raw_body(req)
  });
}
async function setResponse(res, response) {
  const headers = Object.fromEntries(response.headers);
  if (response.headers.has("set-cookie")) {
    headers["set-cookie"] = response.headers.raw()["set-cookie"];
  }
  res.writeHead(response.status, headers);
  if (response.body instanceof import_stream.Readable) {
    response.body.pipe(res);
  } else {
    if (response.body) {
      res.write(await response.arrayBuffer());
    }
    res.end();
  }
}

// .svelte-kit/output/server/app.js
init_index_08869495();
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _use_hashes;
var _dev;
var _script_needs_csp;
var _style_needs_csp;
var _directives;
var _script_src;
var _style_src;
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  {
    stores.page.set(page);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && body._writableState && body._events)
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const handler = mod[event.request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    return;
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(normalized_body, {
    status,
    headers
  });
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }
  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry4) {
    return entry4[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry4, i2) {
    names.set(entry4[0], getName(i2));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a4) {
            var k = _a4[0], v = _a4[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop3() {
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var escape_json_in_html_dict = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var escape_json_value_in_html_dict = {
  '"': '\\"',
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape_json_in_html(str) {
  return str.replace(/[&><\u2028\u2029]/g, (match) => escape_json_in_html_dict[match]);
}
function escape_json_value_in_html(str) {
  return escape2(str, escape_json_value_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
function escape2(str, dict, unicode_encoder) {
  let result = "";
  for (let i2 = 0; i2 < str.length; i2 += 1) {
    const char = str.charAt(i2);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i2];
      } else {
        result += unicode_encoder(code);
      }
    } else {
      result += char;
    }
  }
  return result;
}
var escape_html_attr_dict = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escape_html_attr(str) {
  return '"' + escape2(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
var s2 = JSON.stringify;
function create_prerendering_url_proxy(url) {
  return new Proxy(url, {
    get: (target, prop, receiver) => {
      if (prop === "search" || prop === "searchParams") {
        throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array = encode(data);
  for (let i2 = 0; i2 < array.length; i2 += 16) {
    const w = array.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var generate_nonce;
var generate_hash;
if (typeof crypto !== "undefined") {
  const array = new Uint8Array(16);
  generate_nonce = () => {
    crypto.getRandomValues(array);
    return base64(array);
  };
  generate_hash = sha256;
} else {
  const name = "crypto";
  csp_ready = import(name).then((crypto2) => {
    generate_nonce = () => {
      return crypto2.randomBytes(16).toString("base64");
    };
    generate_hash = (input) => {
      return crypto2.createHash("sha256").update(input, "utf-8").digest().toString("base64");
    };
  });
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    __privateAdd2(this, _use_hashes, void 0);
    __privateAdd2(this, _dev, void 0);
    __privateAdd2(this, _script_needs_csp, void 0);
    __privateAdd2(this, _style_needs_csp, void 0);
    __privateAdd2(this, _directives, void 0);
    __privateAdd2(this, _script_src, void 0);
    __privateAdd2(this, _style_src, void 0);
    __privateSet2(this, _use_hashes, mode === "hash" || mode === "auto" && prerender);
    __privateSet2(this, _directives, dev ? __spreadValues({}, directives) : directives);
    __privateSet2(this, _dev, dev);
    const d = __privateGet2(this, _directives);
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    __privateSet2(this, _script_src, []);
    __privateSet2(this, _style_src, []);
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    __privateSet2(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
    __privateSet2(this, _style_needs_csp, !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
    this.script_needs_nonce = __privateGet2(this, _script_needs_csp) && !__privateGet2(this, _use_hashes);
    this.style_needs_nonce = __privateGet2(this, _style_needs_csp) && !__privateGet2(this, _use_hashes);
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (__privateGet2(this, _script_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _script_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _script_src).length === 0) {
        __privateGet2(this, _script_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (__privateGet2(this, _style_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _style_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _style_src).length === 0) {
        __privateGet2(this, _style_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = __spreadValues({}, __privateGet2(this, _directives));
    if (__privateGet2(this, _style_src).length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _style_src)
      ];
    }
    if (__privateGet2(this, _script_src).length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _script_src)
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
_use_hashes = /* @__PURE__ */ new WeakMap();
_dev = /* @__PURE__ */ new WeakMap();
_script_needs_csp = /* @__PURE__ */ new WeakMap();
_style_needs_csp = /* @__PURE__ */ new WeakMap();
_directives = /* @__PURE__ */ new WeakMap();
_script_src = /* @__PURE__ */ new WeakMap();
_style_src = /* @__PURE__ */ new WeakMap();
var updated = __spreadProps(__spreadValues({}, readable(false)), {
  check: () => false
});
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2,
  url,
  params,
  ssr,
  stuff
}) {
  if (state.prerender) {
    if (options.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %svelte.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url2) => stylesheets.add(url2));
      if (node.js)
        node.js.forEach((url2) => modulepreloads.add(url2));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session,
        updated
      },
      page: {
        url: state.prerender ? create_prerendering_url_proxy(url) : url,
        params,
        status,
        error: error2,
        stuff
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerender,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [
					${(branch || []).map(({ node }) => `import(${s2(options.prefix + node.entry)})`).join(",\n						")}
				],
				url: new URL(${s2(url.href)}),
				params: ${devalue(params)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('${options.service_worker}');
		}
	`;
  if (options.amp) {
    head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${inlined_style}
${rendered.css.code}</style>`;
    if (options.service_worker) {
      head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
      body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
    }
  } else {
    if (inlined_style) {
      const attributes = [];
      if (options.dev)
        attributes.push(" data-svelte");
      if (csp.style_needs_nonce)
        attributes.push(` nonce="${csp.nonce}"`);
      csp.add_style(inlined_style);
      head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
    }
    head += Array.from(stylesheets).map((dep) => {
      const attributes = [
        'rel="stylesheet"',
        `href="${options.prefix + dep}"`
      ];
      if (csp.style_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      if (styles.has(dep)) {
        attributes.push("disabled", 'media="(max-width: 0)"');
      }
      return `
	<link ${attributes.join(" ")}>`;
    }).join("");
    if (page_config.router || page_config.hydrate) {
      head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
      const attributes = ['type="module"', `data-hydrate="${target}"`];
      csp.add_script(init_app);
      if (csp.script_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
      body += serialized_data.map(({ url: url2, body: body2, json }) => {
        let attributes2 = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url2)}`;
        if (body2)
          attributes2 += ` data-body="${hash(body2)}"`;
        return `<script ${attributes2}>${json}<\/script>`;
      }).join("\n	");
      if (shadow_props) {
        body += `<script type="application/json" data-type="svelte-props">${escape_json_in_html(s2(shadow_props))}<\/script>`;
      }
    }
    if (options.service_worker) {
      csp.add_script(init_service_worker);
      head += `
				<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
    }
  }
  if (state.prerender) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (maxage) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = options.template({ head, body, assets: assets2, nonce: csp.nonce });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (maxage) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerender) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && /\/[^./]+$/.test(path)) {
    return path + "/";
  }
  return path;
}
async function load_node({
  event,
  options,
  state,
  route,
  url,
  params,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const shadow = is_leaf ? await load_shadow_data(route, event, !!state.prerender) : {};
  if (shadow.fallthrough)
    return;
  if (shadow.cookies) {
    set_cookie_headers.push(...shadow.cookies);
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerender ? create_prerendering_url_proxy(url) : url,
      params,
      props: shadow.body || {},
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        opts.headers.set("referer", event.url.href);
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest._.mime[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            const authorization = event.request.headers.get("authorization");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, opts), options, {
            fetched: requested,
            initiator: route
          });
          if (state.prerender) {
            dependency = { response, body: null };
            state.prerender.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 === "set-cookie") {
                  set_cookie_headers = set_cookie_headers.concat(value);
                } else if (key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                fetched.push({
                  url: requested,
                  body: opts.body,
                  json: `{"status":${response2.status},"statusText":${s2(response2.statusText)},"headers":${s2(headers)},"body":"${escape_json_value_in_html(body)}"}`
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }
            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: __spreadValues({}, stuff)
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (loaded.fallthrough && !is_error) {
    return;
  }
  if (shadow.body && state.prerender) {
    const pathname = `${event.url.pathname}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerender.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
async function load_shadow_data(route, event, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have shadow endpoints with mutative methods");
    }
    const method = event.request.method.toLowerCase().replace("delete", "del");
    const handler = mod[method];
    if (!handler) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (method !== "get") {
      const result = await handler(event);
      if (result.fallthrough)
        return result;
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    if (mod.get) {
      const result = await mod.get.call(null, event);
      if (result.fallthrough)
        return result;
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = __spreadValues(__spreadValues({}, body), data.body);
    }
    return data;
  } catch (e2) {
    return {
      status: 500,
      error: coalesce_to_error(e2)
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Shadow endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from shadow endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({ event, options, state, $session, status, error: error2, ssr }) {
  try {
    const default_layout = await options.manifest._.nodes[0]();
    const default_error = await options.manifest._.nodes[1]();
    const params = {};
    const layout_loaded = await load_node({
      event,
      options,
      state,
      route: null,
      url: event.url,
      params,
      node: default_layout,
      $session,
      stuff: {},
      is_error: false,
      is_leaf: false
    });
    const error_loaded = await load_node({
      event,
      options,
      state,
      route: null,
      url: event.url,
      params,
      node: default_error,
      $session,
      stuff: layout_loaded ? layout_loaded.stuff : {},
      is_error: true,
      is_leaf: false,
      status,
      error: error2
    });
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff: error_loaded.stuff,
      status,
      error: error2,
      branch: [layout_loaded, error_loaded],
      url: event.url,
      params,
      ssr
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, ssr } = opts;
  let nodes;
  if (!ssr) {
    return await render_response(__spreadProps(__spreadValues({}, opts), {
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      url: event.url,
      stuff: {}
    }));
  }
  try {
    nodes = await Promise.all(route.a.map((n) => options.manifest._.nodes[n] && options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      ssr
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return new Response(void 0, {
      status: 204
    });
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  let stuff = {};
  ssr:
    if (ssr) {
      for (let i2 = 0; i2 < nodes.length; i2 += 1) {
        const node = nodes[i2];
        let loaded;
        if (node) {
          try {
            loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
              url: event.url,
              node,
              stuff,
              is_error: false,
              is_leaf: i2 === nodes.length - 1
            }));
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies(new Response(void 0, {
                status: loaded.loaded.status,
                headers: {
                  location: loaded.loaded.redirect
                }
              }), set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e2 = coalesce_to_error(err);
            options.handle_error(e2, event);
            status = 500;
            error2 = e2;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i2--) {
              if (route.b[i2]) {
                const error_node = await options.manifest._.nodes[route.b[i2]]();
                let node_loaded;
                let j = i2;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                    url: event.url,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    is_error: true,
                    is_leaf: false,
                    status,
                    error: error2
                  }));
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                  break ssr;
                } catch (err) {
                  const e2 = coalesce_to_error(err);
                  options.handle_error(e2, event);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              event,
              options,
              state,
              $session,
              status,
              error: error2,
              ssr
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
        }
      }
    }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      stuff,
      url: event.url,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, ssr) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  const response = await respond$1({
    event,
    options,
    state,
    $session,
    route,
    params: event.params,
    ssr
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return new Response(`Bad request in load function: failed to fetch ${state.fetched}`, {
      status: 500
    });
  }
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
var DATA_SUFFIX = "/__data.json";
async function respond(request, options, state = {}) {
  var _a4;
  const url = new URL(request.url);
  const normalized = normalize_path(url.pathname, options.trailing_slash);
  if (normalized !== url.pathname) {
    return new Response(void 0, {
      status: 301,
      headers: {
        location: normalized + (url.search === "?" ? "" : url.search)
      }
    });
  }
  const { parameter, allowed } = options.method_override;
  const method_override = (_a4 = url.searchParams.get(parameter)) == null ? void 0 : _a4.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  const event = {
    request,
    url,
    params: {},
    locals: {},
    platform: state.platform
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let ssr = true;
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        if (opts && "ssr" in opts)
          ssr = opts.ssr;
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            url: event2.url,
            params: event2.params,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            branch: [],
            ssr: false
          });
        }
        let decoded = decodeURI(event2.url.pathname);
        if (options.paths.base) {
          if (!decoded.startsWith(options.paths.base)) {
            return new Response(void 0, { status: 404 });
          }
          decoded = decoded.slice(options.paths.base.length) || "/";
        }
        const is_data_request = decoded.endsWith(DATA_SUFFIX);
        if (is_data_request)
          decoded = decoded.slice(0, -DATA_SUFFIX.length) || "/";
        for (const route of options.manifest._.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          event2.params = route.params ? decode_params(route.params(match)) : {};
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (response2 && response2.status >= 300 && response2.status < 400 && request.headers.get("x-sveltekit-noredirect") === "true") {
              const location = response2.headers.get("location");
              if (location) {
                const headers = new Headers(response2.headers);
                headers.set("x-sveltekit-location", location);
                response2 = new Response(void 0, {
                  status: 204,
                  headers
                });
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, ssr);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            ssr
          });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        ssr
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="/favicon.png" />\n    <meta\n      name="viewport"\n      content="width=device-width, initial-scale=1"\n    />\n    ' + head + '\n  </head>\n  <body>\n    <div id="svelte">' + body + "</div>\n  </body>\n</html>\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var App = class {
  constructor(manifest2) {
    const hooks = get_hooks(user_hooks);
    this.options = {
      amp: false,
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/",
      prerender: true,
      read,
      root: Root,
      service_worker: null,
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  render(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to app.render must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/vercel-tmp/manifest.js
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png"]),
  _: {
    mime: { ".png": "image/png" },
    entry: { "file": "start-63257875.js", "js": ["start-63257875.js", "chunks/vendor-1b4702e0.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3))
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      }
    ]
  }
};

// .svelte-kit/vercel-tmp/entry.js
var app = new App(manifest);
var entry_default = async (req, res) => {
  let request;
  try {
    request = await getRequest(`https://${req.headers.host}`, req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  setResponse(res, await app.render(request));
};
module.exports = __toCommonJS(entry_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
