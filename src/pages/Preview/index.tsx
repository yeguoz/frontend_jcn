import { Flex, Spin, Image, Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import MDEditor from "@uiw/react-md-editor";
import ReactPlayer from "react-player";
import { Editor } from "@monaco-editor/react";
import axios from "../../../config/axios";
import { getSessionId } from "../../services/userController";
import Navbar from "../../components/Navbar";
import { authItems, homeItems } from "../../constants/common";
import useAuthStore from "../../store/useAuthStore";

export const Preview = () => {
  const imageExtensions = new Set([
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "bmp",
    "svg",
    "ico"
  ]);
  const videoExtensions = new Set(["mp4", "webm", "ogv", "mov", "mkv","wmv","movie"]);
  const audioExtensions = new Set([
    "mp3",
    "aac",
    "m4a",
    "ogg",
    "oga",
    "opus",
    "wav",
    "flac",
    "webm",
  ]);
  const textFileExtensions = new Set([
    // 纯文本 & 标记语言
    "txt",
    "md",
    "csv",
    "log",
    "json",
    "yaml",
    "yml",
    "xml",
    "ini",
    "toml",
    "conf",
    "tex",
    "rst",
    "asciidoc",
    // Web 开发
    "js",
    "mjs",
    "cjs",
    "ts",
    "tsx",
    "jsx",
    "vue",
    "svelte",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    // 后端开发
    "java",
    "kt",
    "kts",
    "groovy",
    "scala",
    "php",
    "py",
    "rb",
    "go",
    "rs",
    "swift",
    "dart",
    "perl",
    "pl",
    "r",
    "jl",
    // C 语言家族
    "c",
    "h",
    "cpp",
    "cxx",
    "cc",
    "hpp",
    "hxx",
    "cs",
    "m",
    "mm",
    // 脚本 & DevOps
    "sh",
    "bash",
    "zsh",
    "bat",
    "cmd",
    "ps1",
    "dockerfile",
    "tcl",
    // 配置文件
    "yaml",
    "yml",
    "json",
    "toml",
    "ini",
    "conf",
    // 数据库 & 查询语言
    "sql",
    "graphql",
    "gql",
    "cypher",
    "prisma",
    // 科学计算 & 数据分析
    "ipynb",
    "r",
    "m",
    "sas",
    "stata",
    "jl",
    // 低级开发
    "asm",
    "s",
    "a51",
    "v",
    "vh",
    "vhd",
    "vhdl",
    // 函数式编程
    "hs",
    "ml",
    "mli",
    "clj",
    "cljs",
    "cljc",
    "rkt",
    "erl",
    "hrl",
    "ex",
    "exs",
    "f#",
    "fs",
    "fsi",
    "fsx",
    // 老牌语言
    "pas",
    "pp",
    "adb",
    "ads",
    "for",
    "f90",
    "f95",
    "lisp",
    "cl",
    "el",
    "pro",
  ]);
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get("filePath");
  const filename = searchParams.get("filename");
  const shortId = searchParams.get("shortId");
  const [language, setLanguage] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState("light");
  const [value, setValue] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const extension = filename?.split(".").pop()?.toLowerCase() || "";

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSessionId();
      setSessionId(response.data);
      setUrl(
        import.meta.env.PROD
          ? ""
          : `/api/${filePath}?token=${response.data}&shortId=${shortId}`
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleData = async () => {
      try {
        console.log("url:", url);
        const response = await axios.get(url, {
          responseType: "blob",
        });

        if (response.data instanceof Blob) {
          const reader = new FileReader();

          // 使用 Promise 包装 FileReader 的异步操作
          const fileContent = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              resolve(reader.result as string); // 获取文本内容
            };
            reader.onerror = () => {
              reject(new Error("读取文件失败"));
            };
            reader.readAsText(response.data); // 读取 Blob 为文本
          });

          setValue(fileContent);
        } else {
          throw new Error("响应不是 Blob 类型");
        }
      } catch (error) {
        console.error("请求失败:", error);
      }
    };
    if (url !== "" && textFileExtensions.has(extension)) {
      handleData();
    }
  }, [url]);

  // 图片文件预览
  if (imageExtensions.has(extension)) {
    return (
      <Container>
        <>
          <Image
            height={500}
            fallback="data:image/png;base64,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"
            src={url}
          />
        </>
      </Container>
    );
  }
  // 视频文件预览
  if (videoExtensions.has(extension)) {
    return (
      <Container>
        <div
          style={{
            borderRadius: "10px",
            width: "70%",
            overflow: "hidden",
            marginTop: 20,
          }}
        >
          <ReactPlayer url={url} controls width="100%" height="auto" />
        </div>
      </Container>
    );
  }

  // 音频文件预览
  if (audioExtensions.has(extension)) {
    return (
      <Container>
        <>
          <ReactPlayer url={url} controls style={{ marginTop: 20 }} />
        </>
      </Container>
    );
  }

  // 文本、markdown和代码文件预览
  if (textFileExtensions.has(extension)) {
    if (extension === "md" || extension === "txt") {
      return (
        <Container>
          <MDEditor
            value={value}
            height="90%"
            style={{ width: "95%", marginTop: 20 }}
            onChange={(newValue) => setValue(newValue || "")}
          />
        </Container>
      );
    }

    // 代码文件使用 Monaco 编辑器
    return (
      <Container>
        <div style={{ width: "90%", height: "100%" }}>
          <Flex gap={30}>
            <div>
              <span>语言：</span>
              <Select
                showSearch
                defaultValue="javascript"
                style={{ width: 120 }}
                onChange={(value) => {
                  setLanguage(value);
                }}
                options={[
                  { value: "javascript", label: "JavaScript" },
                  { value: "typescript", label: "TypeScript" },
                  { value: "java", label: "Java" },
                  { value: "python", label: "Python" },
                  { value: "c", label: "C" },
                  { value: "cpp", label: "C++" },
                  { value: "csharp", label: "C#" },
                  { value: "html", label: "HTML" },
                  { value: "css", label: "CSS" },
                  { value: "scss", label: "SCSS" },
                  { value: "less", label: "Less" },
                  { value: "json", label: "JSON" },
                  { value: "markdown", label: "Markdown" },
                  { value: "yaml", label: "YAML" },
                  { value: "shell", label: "Shell Script" },
                  { value: "sql", label: "SQL" },
                  { value: "php", label: "PHP" },
                  { value: "go", label: "Go" },
                  { value: "rust", label: "Rust" },
                  { value: "swift", label: "Swift" },
                  { value: "ruby", label: "Ruby" },
                  { value: "dockerfile", label: "Dockerfile" },
                  { value: "xml", label: "XML" },
                  { value: "perl", label: "Perl" },
                  { value: "graphql", label: "GraphQL" },
                  { value: "kotlin", label: "Kotlin" },
                  { value: "r", label: "R" },
                  { value: "dart", label: "Dart" },
                  { value: "lua", label: "Lua" },
                  { value: "powershell", label: "PowerShell" },
                  { value: "objective-c", label: "Objective-C" },
                  { value: "vb", label: "Visual Basic" },
                  { value: "coffeescript", label: "CoffeeScript" },
                  { value: "fsharp", label: "F#" },
                  { value: "clojure", label: "Clojure" },
                  { value: "pascal", label: "Pascal" },
                  { value: "elixir", label: "Elixir" },
                  { value: "erlang", label: "Erlang" },
                  { value: "matlab", label: "MATLAB" },
                  { value: "haskell", label: "Haskell" },
                  { value: "scheme", label: "Scheme" },
                  { value: "verilog", label: "Verilog" },
                  { value: "vhdl", label: "VHDL" },
                  { value: "tcl", label: "Tcl" },
                  { value: "sas", label: "SAS" },
                  { value: "stata", label: "Stata" },
                  { value: "fortran", label: "Fortran" },
                  { value: "ada", label: "Ada" },
                  { value: "nim", label: "Nim" },
                  { value: "ocaml", label: "OCaml" },
                  { value: "julia", label: "Julia" },
                  { value: "racket", label: "Racket" },
                ]}
              />
            </div>
            <div>
              <span>主题：</span>
              <Select
                showSearch
                defaultValue="light"
                style={{ width: 120 }}
                onChange={(value) => {
                  setEditorTheme(value);
                }}
                options={[
                  { value: "light", label: "Light" },
                  { value: "vs-dark", label: "VS-Dark" },
                  { value: "hc-black", label: "HC-Black" },
                ]}
              />
            </div>
          </Flex>
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="javascript"
            language={language}
            value={value}
            theme={editorTheme}
            onChange={(newValue) => setValue(newValue || "")}
            options={{ automaticLayout: true }}
            loading={<Spin />}
          />
        </div>
      </Container>
    );
  }
  // pdf
  if (extension === "pdf") {
    return (
      <Container>
        <iframe src={url} style={{ width: "100%", height: "100%" }} />
      </Container>
    );
  }

  if (extension === "doc" || extension === "docx") {
    const url = `http://172.206.83.103:8080/api/${filePath}?token=${sessionId}`;
    const encodedUrl = encodeURIComponent(btoa(encodeURIComponent(url)));
    return (
      <iframe
        src={`http://192.168.10.132:8012/onlinePreview?url=${encodedUrl}`}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
  // office

  return (
    <Container>
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <div>不支持类型</div>
      </Flex>
    </Container>
  );
};

const Container = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  return (
    <Flex style={{ flex: 1, overflow: "hidden" }}>
      {isAuth ? (
        <Navbar
          menuItems={homeItems}
          showStorage
          style={{
            flexShrink: 0,
          }}
        />
      ) : (
        <Navbar
          menuItems={authItems}
          style={{
            flexShrink: 0,
          }}
        />
      )}
      <Flex
        vertical={true}
        align="center"
        style={{ height: "100%", width: "100%" }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
