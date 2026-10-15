/**
 * Family tree data — edit this file to customize the tree.
 *
 * Open index.html in a browser after saving changes (refresh to see them).
 *
 * Fields for each person:
 *   id           string     unique id (used by spouseId / childrenIds)
 *   name         string     primary name, line 1 (e.g. Chinese name "陳良財")
 *   englishName  string     optional English name, line 2 — ONLY for English names Bill supplies himself; never romanize/invent (omit / "" to hide)
 *   gender       "male" | "female"
 *   role         "bloodline" | "spouse"
 *                 bloodline + male   → solid light-blue border
 *                 bloodline + female → solid light-pink border
 *                 spouse             → light-gray dashed border (any gender)
 *   birthDate    string     "YYYY-MM-DD", line 3, shown as YYYY • MM • DD
 *                           (partial dates like "1975" or "1975-11" OK)
 *   deathDate    string     optional; kept for your records but NEVER displayed
 *   photoUrl     string     optional image path or URL; default avatar (avatars/) by gender if omitted
 *   spouseId     string     optional id of spouse (set on both partners)
 *   childrenIds  string[]   ids of children (usually listed on the bloodline parent)
 *
 * rootId: the top-most person to start drawing from.
 */
window.FAMILY_DATA = {
  "rootId": "g14_kongyong",
  "people": {
    "qingshui": {
      "id": "qingshui",
      "name": "陳清水",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1926-04-15",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yebo",
      "childrenIds": [
        "liangtong",
        "liangming",
        "liangcai",
        "caiyun",
        "liangbi",
        "xuezhen"
      ]
    },
    "yebo": {
      "id": "yebo",
      "name": "陳葉泊",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1927-05-18",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "qingshui",
      "childrenIds": []
    },
    "liangtong": {
      "id": "liangtong",
      "name": "陳良桐",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1946-09-04",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "suxiang",
      "childrenIds": [
        "yaling",
        "weicheng",
        "zhanbin"
      ]
    },
    "suxiang": {
      "id": "suxiang",
      "name": "嚴素香",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1949-03-13",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "liangtong",
      "childrenIds": []
    },
    "liangming": {
      "id": "liangming",
      "name": "陳良銘",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1948-05-18",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "suxing",
      "childrenIds": [
        "yufan"
      ]
    },
    "suxing": {
      "id": "suxing",
      "name": "劉素杏",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1953-08-26",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "liangming",
      "childrenIds": []
    },
    "liangcai": {
      "id": "liangcai",
      "name": "陳良財",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1950-03-10",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "huiying",
      "childrenIds": [
        "jiayi",
        "shaoyi"
      ]
    },
    "huiying": {
      "id": "huiying",
      "name": "簡惠瑛",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1950-05-02",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "liangcai",
      "childrenIds": []
    },
    "caiyun": {
      "id": "caiyun",
      "name": "陳彩雲",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1952-01-06",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "mingda",
      "childrenIds": [
        "hongyi",
        "hongkai"
      ]
    },
    "mingda": {
      "id": "mingda",
      "name": "温明達",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1952-06-30",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "caiyun",
      "childrenIds": []
    },
    "liangbi": {
      "id": "liangbi",
      "name": "陳良弼",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1954-02-21",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "shujin",
      "childrenIds": [
        "yici",
        "yufan2"
      ]
    },
    "shujin": {
      "id": "shujin",
      "name": "蘇淑津",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1957-01-15",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "liangbi",
      "childrenIds": []
    },
    "xuezhen": {
      "id": "xuezhen",
      "name": "陳雪禎",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1957-05-06",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "xintu",
      "childrenIds": [
        "lipei",
        "jiayu"
      ]
    },
    "xintu": {
      "id": "xintu",
      "name": "許新土",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1956-11-14",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "xuezhen",
      "childrenIds": []
    },
    "yaling": {
      "id": "yaling",
      "name": "陳雅鈴",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1970-07-07",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "mingzhou",
      "childrenIds": []
    },
    "mingzhou": {
      "id": "mingzhou",
      "name": "江銘洲",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1967-06-21",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yaling",
      "childrenIds": []
    },
    "weicheng": {
      "id": "weicheng",
      "name": "陳威成",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1972-05-31",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "jiaying",
      "childrenIds": [
        "qianyu",
        "siyu"
      ]
    },
    "jiaying": {
      "id": "jiaying",
      "name": "龔家瑩",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1978-07-26",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "weicheng",
      "childrenIds": []
    },
    "zhanbin": {
      "id": "zhanbin",
      "name": "陳展斌",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1974-07-28",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yamei",
      "childrenIds": [
        "weirui",
        "yafei"
      ]
    },
    "yamei": {
      "id": "yamei",
      "name": "蔡雅玫",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1979-07-01",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "zhanbin",
      "childrenIds": []
    },
    "yufan": {
      "id": "yufan",
      "name": "陳昱帆",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1980-12-04",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yuhan",
      "childrenIds": [
        "xiangcheng",
        "youxuan"
      ]
    },
    "yuhan": {
      "id": "yuhan",
      "name": "夏于涵",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1980-10-01",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yufan",
      "childrenIds": []
    },
    "jiayi": {
      "id": "jiayi",
      "name": "陳佳沂",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1979-07-12",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "jinjie",
      "childrenIds": [
        "yijing"
      ]
    },
    "jinjie": {
      "id": "jinjie",
      "name": "李進傑",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1980-01-03",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "jiayi",
      "childrenIds": []
    },
    "shaoyi": {
      "id": "shaoyi",
      "name": "陳劭沂",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1983-07-01",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "luke",
      "childrenIds": [
        "humphrey",
        "laurence"
      ]
    },
    "luke": {
      "id": "luke",
      "name": "Luke Maxwell",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1987-01-24",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "shaoyi",
      "childrenIds": []
    },
    "hongyi": {
      "id": "hongyi",
      "name": "温宏逸",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1977-12-04",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "qiuhui",
      "childrenIds": [
        "xinning",
        "youning"
      ]
    },
    "qiuhui": {
      "id": "qiuhui",
      "name": "黃秧慧",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1981-10-15",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "hongyi",
      "childrenIds": []
    },
    "hongkai": {
      "id": "hongkai",
      "name": "温宏凱",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1981-02-23",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "yici": {
      "id": "yici",
      "name": "陳伊慈",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1984-09-04",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "zongtai",
      "childrenIds": []
    },
    "zongtai": {
      "id": "zongtai",
      "name": "葉宗泰",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "1982-03-23",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yici",
      "childrenIds": []
    },
    "yufan2": {
      "id": "yufan2",
      "name": "陳予範",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "1987-05-30",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "jiayi2",
      "childrenIds": [
        "keteng",
        "kenuo"
      ]
    },
    "jiayi2": {
      "id": "jiayi2",
      "name": "全家儀",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "1988-09-24",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "yufan2",
      "childrenIds": []
    },
    "lipei": {
      "id": "lipei",
      "name": "許莉珮",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1985-12-14",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "jiayu": {
      "id": "jiayu",
      "name": "許家瑜",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "1994-03-04",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "qianyu": {
      "id": "qianyu",
      "name": "陳芊羽",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "2003-09-27",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "siyu": {
      "id": "siyu",
      "name": "陳思聿",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "2006-08-20",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "weirui": {
      "id": "weirui",
      "name": "陳緯睿",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2012-07-02",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "yafei": {
      "id": "yafei",
      "name": "陳婭菲",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "2020-01-01",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "xiangcheng": {
      "id": "xiangcheng",
      "name": "陳湘程",
      "englishName": "Sean",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2011-08-28",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "youxuan": {
      "id": "youxuan",
      "name": "陳佑宣",
      "englishName": "Elon",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2016-08-31",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "yijing": {
      "id": "yijing",
      "name": "李沂靜",
      "englishName": "Cammy",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "2014-05-09",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "humphrey": {
      "id": "humphrey",
      "name": "Humphrey Maxwell",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2017-12-30",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "laurence": {
      "id": "laurence",
      "name": "Laurence Maxwell",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2021-06-24",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "xinning": {
      "id": "xinning",
      "name": "温芯寧",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "2013-04-10",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "youning": {
      "id": "youning",
      "name": "温祐寧",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2016-03-07",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "keteng": {
      "id": "keteng",
      "name": "陳可騰",
      "englishName": "Marcus",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2022-07-02",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "kenuo": {
      "id": "kenuo",
      "name": "陳可諾",
      "englishName": "Nolan",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "2025-01-03",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g14_kongyong": {
      "id": "g14_kongyong",
      "name": "公孔用",
      "englishName": "(未來台)",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g14_yushi",
      "childrenIds": [
        "g15_minghe",
        "g15_tushi"
      ]
    },
    "g14_yushi": {
      "id": "g14_yushi",
      "name": "餘氏",
      "englishName": "(來台開基媽)",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g14_kongyong",
      "childrenIds": []
    },
    "g15_minghe": {
      "id": "g15_minghe",
      "name": "名赫",
      "englishName": "(未來台)",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g15_tushi": {
      "id": "g15_tushi",
      "name": "涂氏",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g16_wenxiu",
        "g16_wenqu",
        "g16_xinchang",
        "g16_xinfu"
      ]
    },
    "g16_wenxiu": {
      "id": "g16_wenxiu",
      "name": "文秀",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g16_wenqu": {
      "id": "g16_wenqu",
      "name": "文曲",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g16_xinfu": {
      "id": "g16_xinfu",
      "name": "新扶",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g16_xinchang": {
      "id": "g16_xinchang",
      "name": "新長",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g17_chuangpang",
        "g17_chuangzhu",
        "g17_chuangbao",
        "g17_chuangyin"
      ]
    },
    "g17_chuangpang": {
      "id": "g17_chuangpang",
      "name": "窓龐",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g17_chuangzhu": {
      "id": "g17_chuangzhu",
      "name": "窓註",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g17_chuangyin": {
      "id": "g17_chuangyin",
      "name": "窓印",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g17_chuangbao": {
      "id": "g17_chuangbao",
      "name": "窓抱",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g18_jin",
        "g18_shangbai",
        "g18_shangsan"
      ]
    },
    "g18_shangbai": {
      "id": "g18_shangbai",
      "name": "尚白",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g18_shangsan": {
      "id": "g18_shangsan",
      "name": "尚三",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g18_jin": {
      "id": "g18_jin",
      "name": "進",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g19_wang",
        "g19_chun",
        "g19_weicun",
        "g19_weichao",
        "g19_weijun"
      ]
    },
    "g19_wang": {
      "id": "g19_wang",
      "name": "旺",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g20_xi",
        "g20_xian",
        "g20_ping"
      ]
    },
    "g19_chun": {
      "id": "g19_chun",
      "name": "春",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g20_cheng",
        "qingshui",
        "g20_feng"
      ]
    },
    "g19_weicun": {
      "id": "g19_weicun",
      "name": "為存",
      "englishName": "(16歲歿)",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g19_weichao": {
      "id": "g19_weichao",
      "name": "為朝",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g20_qingying",
        "g20_qingjian"
      ]
    },
    "g19_weijun": {
      "id": "g19_weijun",
      "name": "為軍",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g20_guoxiong"
      ]
    },
    "g20_qingying": {
      "id": "g20_qingying",
      "name": "清盈",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_qingjian": {
      "id": "g20_qingjian",
      "name": "清鑑",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_guoxiong": {
      "id": "g20_guoxiong",
      "name": "國雄",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_xi": {
      "id": "g20_xi",
      "name": "錫",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_xian": {
      "id": "g20_xian",
      "name": "賢",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_ping": {
      "id": "g20_ping",
      "name": "瓶",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_cheng": {
      "id": "g20_cheng",
      "name": "城",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g20_bilian",
      "childrenIds": [
        "g21_peiyuan",
        "g21_peiqin",
        "g21_jinyun",
        "g21_peigong"
      ]
    },
    "g20_bilian": {
      "id": "g20_bilian",
      "name": "鄭碧蓮",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g20_cheng",
      "childrenIds": []
    },
    "g21_peiyuan": {
      "id": "g21_peiyuan",
      "name": "培元",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_meijing",
      "childrenIds": [
        "g22_sihan",
        "g22_ziying"
      ]
    },
    "g21_meijing": {
      "id": "g21_meijing",
      "name": "賴美靜",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_peiyuan",
      "childrenIds": []
    },
    "g22_sihan": {
      "id": "g22_sihan",
      "name": "思翰",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_ziying": {
      "id": "g22_ziying",
      "name": "咨穎",
      "englishName": "",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_peiqin": {
      "id": "g21_peiqin",
      "name": "培欽",
      "englishName": "大平良和",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_meiling",
      "childrenIds": [
        "g22_maho",
        "g22_mai"
      ]
    },
    "g21_meiling": {
      "id": "g21_meiling",
      "name": "蘇美玲",
      "englishName": "大平美織",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_peiqin",
      "childrenIds": []
    },
    "g22_maho": {
      "id": "g22_maho",
      "name": "大平真帆",
      "englishName": "Maho",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_takahiro",
      "childrenIds": []
    },
    "g22_takahiro": {
      "id": "g22_takahiro",
      "name": "田邊孝大",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_maho",
      "childrenIds": []
    },
    "g22_mai": {
      "id": "g22_mai",
      "name": "大平真衣",
      "englishName": "Mai",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_jinyun": {
      "id": "g21_jinyun",
      "name": "錦雲",
      "englishName": "姿錦",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_fuyuan",
      "childrenIds": [
        "g22_huacheng",
        "g22_huazhi",
        "g22_huashen"
      ]
    },
    "g21_fuyuan": {
      "id": "g21_fuyuan",
      "name": "顏福源",
      "englishName": "",
      "gender": "male",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_jinyun",
      "childrenIds": []
    },
    "g22_huacheng": {
      "id": "g22_huacheng",
      "name": "華成",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_huazhi": {
      "id": "g22_huazhi",
      "name": "華智",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_huashen": {
      "id": "g22_huashen",
      "name": "華伸",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_peigong": {
      "id": "g21_peigong",
      "name": "培恭",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_yihong",
      "childrenIds": [
        "g22_sibao"
      ]
    },
    "g21_yihong": {
      "id": "g21_yihong",
      "name": "李怡紅",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_peigong",
      "childrenIds": []
    },
    "g22_sibao": {
      "id": "g22_sibao",
      "name": "思寰",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g20_feng": {
      "id": "g20_feng",
      "name": "逢",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g20_laihao",
      "childrenIds": [
        "g21_liangquan",
        "g21_guizhen",
        "g21_liangxu",
        "g21_huijuan",
        "g21_guanyu"
      ]
    },
    "g20_laihao": {
      "id": "g20_laihao",
      "name": "許來好",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g20_feng",
      "childrenIds": []
    },
    "g21_liangquan": {
      "id": "g21_liangquan",
      "name": "良全",
      "englishName": "Lian",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": [
        "g22_yujia",
        "g22_hongli"
      ]
    },
    "g22_yujia": {
      "id": "g22_yujia",
      "name": "昱嘉",
      "englishName": "Frank",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_hongli": {
      "id": "g22_hongli",
      "name": "弘曆",
      "englishName": "Alexander",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_guizhen": {
      "id": "g21_guizhen",
      "name": "貴珍",
      "englishName": "Jean",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_zhenfa",
      "childrenIds": [
        "g22_shencheng",
        "g22_shenyi"
      ]
    },
    "g21_zhenfa": {
      "id": "g21_zhenfa",
      "name": "沈珍發",
      "englishName": "Fred",
      "gender": "male",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_guizhen",
      "childrenIds": []
    },
    "g22_shencheng": {
      "id": "g22_shencheng",
      "name": "沈誠",
      "englishName": "肯德 Kendall",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_xuejuan",
      "childrenIds": []
    },
    "g22_xuejuan": {
      "id": "g22_xuejuan",
      "name": "黃雪娟",
      "englishName": "Julia",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_shencheng",
      "childrenIds": []
    },
    "g22_shenyi": {
      "id": "g22_shenyi",
      "name": "沈怡",
      "englishName": "凱倫 Karen",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_liangxu": {
      "id": "g21_liangxu",
      "name": "良旭",
      "englishName": "",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_cuijuan",
      "childrenIds": [
        "g22_dinian",
        "g22_zhennian"
      ]
    },
    "g21_cuijuan": {
      "id": "g21_cuijuan",
      "name": "葉翠娟",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_liangxu",
      "childrenIds": []
    },
    "g22_dinian": {
      "id": "g22_dinian",
      "name": "帝年",
      "englishName": "Dennis",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_beata",
      "childrenIds": []
    },
    "g22_beata": {
      "id": "g22_beata",
      "name": "Beata",
      "englishName": "",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g22_dinian",
      "childrenIds": []
    },
    "g22_zhennian": {
      "id": "g22_zhennian",
      "name": "珍年",
      "englishName": "Jennifer",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_huijuan": {
      "id": "g21_huijuan",
      "name": "慧娟",
      "englishName": "Jenny",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_chongyong",
      "childrenIds": [
        "g22_yunkai",
        "g22_tianming"
      ]
    },
    "g21_chongyong": {
      "id": "g21_chongyong",
      "name": "李崇永",
      "englishName": "Kevin",
      "gender": "male",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_huijuan",
      "childrenIds": []
    },
    "g22_yunkai": {
      "id": "g22_yunkai",
      "name": "李雲開",
      "englishName": "Kenneth",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_tianming": {
      "id": "g22_tianming",
      "name": "李天明",
      "englishName": "Richard",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g21_guanyu": {
      "id": "g21_guanyu",
      "name": "冠宇",
      "englishName": "David",
      "gender": "male",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_shufen",
      "childrenIds": [
        "g22_yuanyuan",
        "g22_kaili"
      ]
    },
    "g21_shufen": {
      "id": "g21_shufen",
      "name": "袁淑芬",
      "englishName": "Debbie",
      "gender": "female",
      "role": "spouse",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": "g21_guanyu",
      "childrenIds": []
    },
    "g22_yuanyuan": {
      "id": "g22_yuanyuan",
      "name": "元元",
      "englishName": "Cathleen",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    },
    "g22_kaili": {
      "id": "g22_kaili",
      "name": "楷立",
      "englishName": "Kelly",
      "gender": "female",
      "role": "bloodline",
      "birthDate": "",
      "deathDate": null,
      "photoUrl": null,
      "spouseId": null,
      "childrenIds": []
    }
  }
};
