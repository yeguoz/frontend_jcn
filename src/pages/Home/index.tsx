import {
  Flex,
  FloatButton,
  notification,
  Skeleton,
  Table,
} from "antd";
import BreadcrumbToolkit from "../../components/BreadcrumbToolkit";
import { useEffect, useRef } from "react";
import {
  fetchChunksStatus,
  fetchUploadedChunks,
  fetchUploadSession,
  mergeChunks,
  uploadChunk,
} from "../../services/userFileController";
import useDataStore from "../../store/useDataStore";
import { useNavigate } from "react-router";
import HeaderMenu from "../../components/HeaderMenu";
import ContextMenu from "../../components/contextMenu/ContextMenu";
import ItemContextMenu from "../../components/contextMenu/ItemContextMenu";
import MultipleMenu from "../../components/contextMenu/MultipleMenu";
import useLoadingStore from "../../store/useLoadingStore";
import EditModal from "../../components/EditModal";
import useVisibleRowsPosStore from "../../store/useVisibleRowsPosStore";
import { CloudUploadOutlined } from "@ant-design/icons";
import ToolIcon from "../../components/icon/ToolIcon";
import ConcurrentUploader from "../../utils/ConcurrentUploader";
import useFetchUserFiles from "../../hooks/useFetchUserFiles";
import FolderUploadIcon from "../../components/icon/FolderUploadIcon";
import { ShareModal } from "../../components/ShareModal";
import { filesColumns, homeItems } from "../../constants/common";
import Navbar from "../../components/Navbar";
import useUploadStore from "../../store/useUploadStore";
import { useWorkerStore } from "../../store/useWorkerStore";
import { debounce, throttle } from "lodash";
import useBreadcrumbStore from "../../store/useBreadcrumbStore";

export const Home = () => {
  const navigate = useNavigate();
  const { data } = useDataStore((state) => state);
  const { items, setNewItem } = useBreadcrumbStore((state) => state);
  const { tableIsLoading, setTableIsLoading } = useLoadingStore(
    (state) => state
  );
  const {
    selectedRows,
    setSelectedRows,
    ctxMenuVisible,
    setCtxMenuVisible,
    itemCtxMenuVisible,
    setItemCtxMenuVisible,
    multipleMenuVisible,
    setMultipleMenuVisible,
    setCtxMenuPosition,
    setItemCtxMenuPosition,
    setMultipleMenuPosition,
    setSelectedRecord,
  } = useVisibleRowsPosStore((state) => state);

  const addTask = useUploadStore((state) => state.addTask);
  const updateTask = useUploadStore((state) => state.updateTask);

  const { path, fetchUserFiles, pathRef } = useFetchUserFiles();
  const ctxMenuRef = useRef<HTMLDivElement>(null);
  const itemCtxMenuRef = useRef<HTMLDivElement>(null);
  const multipleMenuMenuRef = useRef<HTMLDivElement>(null);
  const fileUploadInputRef = useRef<HTMLInputElement | null>(null);
  const dirUploadInputRef = useRef<HTMLInputElement | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const handleCtxMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    let left = event.clientX;
    let top = event.clientY;
    if (event.clientX + 170 > windowWidth) {
      left = event.clientX - 170;
    }
    if (event.clientY + 284 > windowHeight) {
      top = event.clientY - 284;
    }
    setItemCtxMenuVisible(false);
    setMultipleMenuVisible(false);
    setCtxMenuVisible(true);
    setCtxMenuPosition({ x: left, y: top });
  };

  const handleItemCtxMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    record: API.FileDTO
  ) => {
    setSelectedRecord(record);
    event.preventDefault();
    // 阻止冒泡
    event.stopPropagation();
    let left = event.clientX;
    let top = event.clientY;
    if (event.clientX + 170 > windowWidth) {
      left = event.clientX - 170;
    }
    if (event.clientY + 416 > windowHeight) {
      top = event.clientY - (event.clientY + 416 - windowHeight);
    }

    if (selectedRows.includes(record) && selectedRows.length > 1) {
      // 当前是选择rows中一行
      setCtxMenuVisible(false);
      setItemCtxMenuVisible(false);
      setMultipleMenuVisible(true);
      setMultipleMenuPosition({ x: left, y: top });
    } else {
      // 单选
      setCtxMenuVisible(false);
      setMultipleMenuVisible(false);
      setItemCtxMenuVisible(true);
      setItemCtxMenuPosition({ x: left, y: top });
      // 设置选中记录更新keys
      setSelectedRows([record]);
      // 记录当前row信息
      setSelectedRecord(record);
    }
  };

  // 点击空白处处理
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        ctxMenuRef.current &&
        !ctxMenuRef.current.contains(event.target as Node)
      ) {
        setCtxMenuVisible(false);
      }
      if (
        itemCtxMenuRef.current &&
        !itemCtxMenuRef.current.contains(event.target as Node)
      ) {
        setItemCtxMenuVisible(false);
      }
      if (
        multipleMenuMenuRef.current &&
        !multipleMenuMenuRef.current.contains(event.target as Node)
      ) {
        setMultipleMenuVisible(false);
      }
    };
    if (ctxMenuVisible || itemCtxMenuVisible || multipleMenuVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [
    ctxMenuVisible,
    itemCtxMenuVisible,
    multipleMenuVisible,
    setCtxMenuVisible,
    setItemCtxMenuVisible,
    setMultipleMenuVisible,
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 100) {
      api.warning({
        message: "文件数量不能超过100,请压缩后上传",
      });
      return;
    }
    const fileList = Array.from(files);
    e.target.value = "";

    const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

    const uploadTasks: {
      file: File;
      uploadId: number;
      fingerprint: string;
    }[] = [];

    for (const file of fileList) {
      try {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const blobSlice = file.slice(0, 256 * 1024); // 获取文件的前256KB
        const workerAPI = await useWorkerStore.getState().getWorkerAPI();
        const sha256 = await workerAPI.calculateSha256(blobSlice);
        const dirAndFilename =
          file.webkitRelativePath === ""
            ? file.name
            : file.webkitRelativePath + "_" + file.name;
        const fingerprint = sha256 + "_" + file.size + "_" + dirAndFilename;

        // 文件大小为0时不上传
        if (file.size == 0) {
          const errorId = Date.now();
          addTask({
            uploadId: errorId,
            filename: file.name,
            filesize: file.size,
            fingerprint,
            progress: 0,
            status: "error",
            message: "文件大小为0",
            bytes: {},
          });
          continue;
        }

        // 请求上传会话
        const response = await fetchUploadSession(
          fingerprint,
          totalChunks,
          file.name
        );
        // 添加上传队列中
        if (response.code === 200 && response.data) {
          const uploadId: number = response.data;
          addTask({
            uploadId,
            filename: file.name,
            filesize: file.size,
            fingerprint,
            progress: 0,
            status: "pending",
            message: "等待上传...",
            bytes: {},
          });
          uploadTasks.push({ file, uploadId, fingerprint });
        } else {
          const errorId = Date.now();
          addTask({
            uploadId: errorId,
            filename: file.name,
            filesize: file.size,
            fingerprint,
            progress: 0,
            status: "error",
            message: response.message,
            bytes: {},
          });
        }
      } catch (error) {
        console.error("预处理错误:", error);
      }
    }
    
    // 所有文件预处理完成后统一上传
    await Promise.all(
      uploadTasks.map(async ({ file, uploadId, fingerprint }) => {
        await uploadFileInChunks(
          file,
          uploadId,
          fingerprint,
          file.webkitRelativePath
        );
      })
    );
  };

  const uploadFileInChunks = async (
    file: File,
    uploadId: number,
    fingerprint: string,
    webkitRelativePath: string
  ) => {
    const CHUNK_SIZE = 4 * 1024 * 1024;
    const CONCURRENT_LIMIT = 3; // 最大并发数
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploader = new ConcurrentUploader(CONCURRENT_LIMIT);

    // 获取已上传的分片索引
    const uploadedChunksResp = await await fetchUploadedChunks(fingerprint);
    const chunksStatusResp = await fetchChunksStatus(fingerprint);
    const uploadedChunks = uploadedChunksResp.data;
    const mergeCompleted = chunksStatusResp.data;
    if (uploadedChunks.length === totalChunks && !mergeCompleted) {
      console.log("文件分片已上传完成,开始合并分片");
      // 合并分片
      handleMergeChunks(
        uploadId,
        fingerprint,
        file.size,
        file.name,
        totalChunks,
        webkitRelativePath
      );
      return;
    }

    // 处理分片上传
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      if (uploadedChunks.includes(chunkIndex)) {
        // 设置已上传size 更新进度
        updateTask(uploadId, (task) => {
          // 更新对应分片字节数
          task.bytes[chunkIndex] = chunk.size;

          // 更新总进度
          const sumBytes = Object.values(task.bytes || {}).reduce(
            (a, b) => a + b,
            0
          );
          task.progress = task.filesize ? (sumBytes / task.filesize) * 100 : 0;
          task.status = "uploading";
          task.message = ``;
        });
        continue;
      }

      const uploadTask = async () => {
        try {
          const workerAPI = await useWorkerStore.getState().getWorkerAPI();

          // 计算md5
          const md5 = await workerAPI.calculateMD5(chunk);

          updateTask(uploadId, (task) => {
            task.status = "uploading";
            task.message = ``;
          });

          // 上传分片
          const response = await uploadChunk(
            uploadId,
            fingerprint,
            md5,
            chunk,
            file.name,
            chunkIndex,
            totalChunks,
            updateTask
          );

          const chunkVO: API.ChunkVO | undefined = response.data;
          if (response.code === 200 && chunkVO && chunkVO.complete) {
            handleMergeChunks(
              uploadId,
              fingerprint,
              file.size,
              file.name,
              totalChunks,
              webkitRelativePath
            );
          } else if (response.code > 200) {
            updateTask(uploadId, (task) => {
              task.message = response.message;
              task.status = "error";
            });
          }
        } catch (error) {
          console.error(`Chunk ${chunkIndex} 上传失败:`, error);
          updateTask(uploadId, (task) => {
            task.status = "error";
            task.message = `chunk_${chunkIndex}上传失败`;
          });
          // 加入失败重传队列
          uploader.addUploadTask(uploadTask);
        }
      };
      // 添加任务到并发队列
      uploader.addUploadTask(uploadTask);
    }
  };

  // 先用 throttle 包一层
  const throttled = throttle(fetchUserFiles, 1000); // 最多1秒触发一次
  // 再在节流上防抖包一层
  const throttledThenDebounced = debounce(throttled, 500);
  const handleMergeChunks = async (
    uploadId: number,
    fingerprint: string,
    filesize: number,
    filename: string,
    totalChunks: number,
    webkitRelativePath: string
  ) => {
    updateTask(uploadId, (task) => {
      task.message = "合并分片中...";
      task.status = "handle";
    });

    const mergeResp = await mergeChunks(
      path,
      uploadId,
      fingerprint,
      filesize,
      filename,
      totalChunks,
      webkitRelativePath
    );
    if (mergeResp.code === 200) {
      throttledThenDebounced(pathRef.current);
      updateTask(uploadId, (task) => {
        task.message = mergeResp.message;
        task.status = "success";
        task.completed = true;
      });
    } else if (mergeResp.code > 200) {
      updateTask(uploadId, (task) => {
        task.message = mergeResp.message;
        task.status = "error";
      });
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchUserFiles(pathRef.current);
  }, [fetchUserFiles, pathRef]);

  return (
    <Flex style={{ flex: 1, overflow: "hidden" }}>
      {contextHolder}
      <Navbar menuItems={homeItems} showStorage />
      <div
        style={{
          userSelect: "none",
          flex: 1,
          overflow: "hidden",
        }}
        onContextMenu={(event) => {
          handleCtxMenu(event);
        }}
      >
        {selectedRows.length > 0 && <HeaderMenu />}
        <BreadcrumbToolkit />
        {tableIsLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Table<API.FileDTO>
              scroll={{ y: "calc(100vh - 148px)" }}
              rowKey={(record) => record.id}
              columns={filesColumns}
              dataSource={data}
              pagination={false}
              rowSelection={{
                type: "checkbox",
                columnWidth: 40,
                selectedRowKeys: selectedRows.map((item) => item.id),
                onSelectMultiple: (_, selectedRows) => {
                  console.log("onSelectMultiple", selectedRows);
                },
                onChange: (_, selectedRows) => {
                  setCtxMenuVisible(false);
                  setItemCtxMenuVisible(false);
                  setMultipleMenuVisible(false);
                  setSelectedRows(selectedRows);
                  // TODO多选处理 显示菜单
                  if (
                    selectedRows.length <= 1 &&
                    selectedRows[0]?.type === "folder"
                  ) {
                    // TODO 单选文件夹 显示菜单
                    console.log("选中文件夹selectedRows", selectedRows);
                    setSelectedRecord(selectedRows[0]);
                  }
                  if (
                    selectedRows.length <= 1 &&
                    selectedRows[0]?.type === "file"
                  ) {
                    // TODO 单选文件 显示菜单
                    console.log("选中文件selectedRows", selectedRows);
                    setSelectedRecord(selectedRows[0]);
                  }
                },
              }}
              locale={{ emptyText: "no data" }}
              onRow={(record) => {
                return {
                  // TODO操作菜单两种类型，类型1：右键目录或文件，类型2：右键其他位置
                  // TODO单击选中文件或目录，弹出操作菜单
                  onClick: async () => {
                    // 文件处理
                    // if (record.type === "file") {
                    // navigate(`/preview?filePath=${encodeURIComponent(record.sourceName)}`);
                    // }
                    // 文件夹处理
                    if (record.type === "folder") {
                      setTableIsLoading(true);
                      // 设置面包屑
                      setNewItem({
                        path: record.name,
                        name: record.name,
                      });
                      // 发送请求
                      let url = "/";
                      items
                        .filter((item) => item.path !== "/")
                        .forEach((item) => {
                          url += `${item.path}/`;
                        });
                      url += record.name;
                      // 设置URL路径
                      navigate(`?path=${encodeURIComponent(url)}`);
                      // 清空选中行
                      setSelectedRows([]);
                      setTableIsLoading(false);
                    }
                  },
                  onDoubleClick: () => {
                    if (record.type === "file") {
                      setSelectedRows([]);
                      navigate(
                        `/preview?filePath=${encodeURIComponent(
                          record.sourceName
                        )}&filename=${encodeURIComponent(record.name)}`
                      );
                    }
                  },
                  // 右键弹出操作菜单
                  onContextMenu: (event) => {
                    console.log("右键元素：", record);
                    handleItemCtxMenu(event, record);
                  },
                };
              }}
              onHeaderRow={(column, index) => {
                return {
                  // 右击列头，弹出操作菜单
                  onContextMenu: () => {
                    console.log("右击列头", column, index);
                  },
                };
              }}
            />
          </div>
        )}
        {ctxMenuVisible && (
          <ContextMenu
            ref={ctxMenuRef}
            fileUploadInputRef={fileUploadInputRef}
            dirUploadInputRef={dirUploadInputRef}
          />
        )}
        {itemCtxMenuVisible && <ItemContextMenu ref={itemCtxMenuRef} />}
        {multipleMenuVisible && <MultipleMenu ref={multipleMenuMenuRef} />}
        <EditModal />
        <ShareModal />
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<ToolIcon />}
        >
          <FloatButton
            icon={<CloudUploadOutlined />}
            tooltip={"上传文件"}
            onClick={() => {
              fileUploadInputRef.current?.click();
            }}
          />
          <FloatButton
            icon={<FolderUploadIcon />}
            tooltip={"上传目录"}
            onClick={() => {
              dirUploadInputRef.current?.click();
            }}
          />
        </FloatButton.Group>
        <input
          ref={fileUploadInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <input
          ref={dirUploadInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
          {...({
            webkitdirectory: "true",
          } as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      </div>
      {/* <Button
        onClick={() => {
          const buf = new TextEncoder().encode("hello world").buffer;
          console.log(SparkMD5.ArrayBuffer.hash(buf));
          console.log(import.meta.url);
        }}
      >
        按钮
      </Button> */}
    </Flex>
  );
};
