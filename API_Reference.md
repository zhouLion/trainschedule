#请批假功能

## 接口

以下接口均约定返回中包含
{
    status:状态码,//为0时表示成功，其他表示异常。
    message:附加信息,
}





### 验证码

对于任何引用到`VerifyCode`字段的请求，均表示需要验证码

![1555173718370](1555173718370.png)

验证码包含前景和背景，用户将前景拖动到背景缺失出即视为通过验证 

以前景图的左上角为值


**刷新验证码**

​	`Get`/static/verify

​	`Response`  guid 验证码序号（无实际用途）

**前景**

​	`Get`/static/verify-ft.png

**背景**

​	`Get`/static/verify-bg.png









###用户

---

应向审核人员展示被审核人员的基础信息，包括以下字段：

基本：`姓名`  `单位`  `职务`  `家庭住址`  `联系方式`

对于每个申请：` 休假类别` `休假天数`  `路途天数`  




#### 登录

`Post` /account/login/rest

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| UserName   | string | 用户名             |
| Password   | string | 密码               |
| VerifyCode | string | 经AES加密的x轴数值 |




#### 注册[暂不实现前端]

`Post` /account/register/rest

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| UserName   | string | 用户名             |
| Email   | string | 验证邮箱             |
| Password   | string | 密码               |
| ConfirmPassword   | string | 确认密码               |
| Company   | string | 单位路径               |
| VerifyCode | string | 经AES加密的x轴数值 |





#### 个人信息设置

`Post` /users/info

| 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| RealName | string | 用户真实姓名   |
| Duties | string | 职务   |
| Company  | string | 单位路径（下拉框） |
| Phone    | string | 联系方式       |
| Address  | string | 家庭住址       |





#### 个人信息获取

`Get` /users/info

`Reponse`

```josn
{
    "permissionCompanies": [//用户可管控的单位的层级
        {
            "path": "Root\\事业部"
        },
        {
            "path":"Root\\市场部"
        }
    ],
    "address": "北京市海淀区万寿路30号院",
    "phone": "13627271134",
    "duties": "人事",
    "about": null,
    "webSite": null,
    "mutuals": [
        
    ],
    "followings": [
        
    ],
    "followers": [
        
    ],
    "realName": "汉广",
    "userName": "serfend",
    "avatar": "images\\serfend.png",//当值为null时使用 "images\\def-male-logo.png" (def-female-logo.png)
    "date": "2019-03-24T18:16:16.6116118",//账号创建日期
    "gender": 0,//0男,1女,2未知
    "confirmed": false,
    "followed": false,
    "blocked": false,
    "privateAccount": false,
    "iBlocked": false,
    "company": {
        "id": "688f5c6c-b865-40fb-b39a-08d6ba90fc19",
        "name": "人力资源科",
        "path": "Root/事业部/人力资源科",
        "isParent": false,
        "members": null
    },
    "privilege": 0//用户的优先级，低优先级用户当尝试'users/userinfo?username={u}'获取高优先级用户信息时，将不会返回信息
}
```















### 申请

申请可由任意用户发起，并交由指定上级进行审核。

上级审核时，可选择`通过`，也可选择`驳回`，并可以附加审核备注。





#### 提交申请

---

`Post` /apply/submit

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| Param   | json | 包含提交申请实体的提交数据             |
| VerifyCode | string | 经AES加密的x轴数值 |

```json
Param：{
    request:{
        xjts:休假天数,//下拉框
        ltts:路途天数,//下拉框   
    }
    xjlb:休假类别,
    stamp:{
        ldsj:离队时间,
    },
    to:[
        //提交到指定的单位
        //例如当前用户单位路径为 Root/总部/北京分部/事业部/人力资源科
        //以Root为0级，提交到 北京分部 和 人资 层级
        3,5
    ]
}
```
`Response` `string` 申请提交id









#### 获取所有申请

---

`Get`/apply/all

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| path   | string | 获取申请的单位路径,例如全部则为Root  |

`Response`
```json
	{
        [
            {
                id:申请的id,
                from:申请人姓名,
                company:申请来源单位路径,
                create:申请创建的时间,
                status:申请的通过状态,//0:审核中 1:通过所有审核 2:通过，待管理员审核 4:驳回
                remark:如果已驳回或已通过，将存在，表示备注,
                current:当前申请所在层级
            }
            ...
        ]
	}
```









#### 获取单个申请详情

---

`Get`/apply/detail
| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| id   | string | 申请的id  |

`Response`
```json
	{
        id:申请的id,
        from:申请人姓名,
        company:申请来源单位路径,
        create:申请创建的时间,
        status:申请的通过状态,//0:审核中 1:通过 2:驳回
        current:当前申请所在层级,        
        detail:{
            progress:[
                {
                    company:审核单位,
                    hdlstamp:如已处理，将显示处理时间,
                    status:审核状态,//0:审核中 1:通过所有审核 2:通过，待管理员审核 4:驳回
                    remark:备注
                },
                ...
            ],
            info:{
            	fromid:申请人id,
                request:{
                    xjts:休假天数,
                    ltts:路途天数,   
                }
                xjlb:休假类别,
                stamp:{
                    ldsj:离队时间,
                }
            }
        }
	}
```





#### 审核申请

------

`Post` /apply/auth

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| Param   | json | 包含申请实体的提交数据  |

```json
Param：{
    [
        {
            id:申请id,
            apply:申请状态号,//0:通过 1:不通过 ...
            remark:备注
        },
        ...
    ]
}
```







###单位

单位以路径方式表示，如	Root/北京总部/市场运营部/客户管理科





#### 单位包含子单位

---

`post` /company/child

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| path   | string | 需要获取的单位路径             |

`Response`
```json
{
    [
    	{
            id:子单位id
            Name:子单位名称
            Path:子单位路径
            ...
    	},
    	...
    ]
}
```

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| Name   | json | 包含提交申请实体的提交数据             |
| ParentPath | string | 经AES加密的x轴数值 |









#### 创建单位

---

`post` /company/create

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| Name   | string | 新单位名称             |
| ParentPath   | string | 单位的父路径             |

`Response` `string` id 单位的id