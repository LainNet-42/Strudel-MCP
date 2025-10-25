这是我们的开发记录，你只需要按事实记录，不要提建议，这是专业的工作留痕

把strudel 的全部MCP tools 按照 table的形式列一下

| 类别 | 工具名称 | 参数 | 说明 | 必要？ | AIDI备注 |
|------|---------|------|------|--------|----------|
| **基础控制** | init | - | 在浏览器中初始化Strudel | ✓ | |
| | write | pattern: string | 将pattern代码写入编辑器 | ✓ | |
| | append | code: string | 追加代码到当前pattern | ✗ | write可替代 |
| | insert | position: number, code: string | 在指定行插入代码 | ✗ | write可替代 |
| | replace | search: string, replace: string | 替换pattern中的文本 | ✓ | |
| | play | - | 开始播放pattern | ✓ | |
| | pause | - | 暂停播放 | ✗ | 与stop功能相同 |
| | stop | - | 停止播放 | ✓ | |
| | clear | - | 清空编辑器 | ✓ | |
| | get_pattern | - | 获取当前pattern代码 | ✓ | 建议改名read |
| **变换** | transpose | semitones: number | 按半音转调 | | |
| | reverse | - | 反转pattern | | |
| | stretch | factor: number | 时间拉伸 | | |
| | quantize | grid: string | 量化到网格（如"1/16"） | | |
| | humanize | amount?: number (0-1) | 添加人性化timing变化 | | |
| **生成** | generate_variation | type?: string | 创建pattern变奏（subtle/moderate/extreme/glitch/evolving） | | |
| | generate_pattern | style: string, key?: string, bpm?: number | 从风格生成完整pattern | | |
| | generate_drums | style: string, complexity?: number (0-1) | 生成鼓点pattern | | |
| | generate_bassline | key: string, style: string | 生成bassline | | |
| | generate_melody | scale: string, root: string, length?: number | 从音阶生成旋律 | | |
| **分析** | analyze | - | 完整音频分析 | | |
| | analyze_spectrum | - | FFT频谱分析 | | |
| | analyze_rhythm | - | 节奏分析 | | |
| | detect_tempo | - | BPM检测 | | |
| | detect_key | - | 调性检测 | | |
| **效果** | add_effect | effect: string, params?: string | 添加效果到pattern | | |
| | remove_effect | effect: string | 移除效果 | | |
| | set_tempo | bpm: number | 设置BPM | | |
| | add_swing | amount: number (0-1) | 添加swing到pattern | | |
| | apply_scale | scale: string, root: string | 应用音阶到音符 | | |
| **存储** | save | name: string, tags?: string[] | 保存pattern及元数据 | | |
| | load | name: string | 加载已保存的pattern | | |
| | list | tag?: string | 列出已保存的patterns | | |
| **历史** | undo | - | 撤销上一个操作 | | |
| | redo | - | 重做操作 | | |
| **音乐理论** | generate_scale | root: string, scale: string | 生成音阶音符 | | |
| | generate_chord_progression | key: string, style: string | 生成和弦进行（pop/jazz/blues等） | | |
| | generate_euclidean | hits: number, steps: number, sound: string | 生成欧几里得节奏 | | |
| | generate_polyrhythm | sounds: string[], patterns: number[] | 生成复合节奏 | | |
| | generate_fill | style: string, bars?: number | 生成鼓点fill | | |

**总计**: 40个工具，涵盖基础控制、变换、生成、分析、效果、存储、历史和音乐理论8个类别

## 优化记录
[] tools - 只保留必要的基础工具
[] hooks - CC session start 自动init