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






###账号操作

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
|AuthCode|json|授权码，经有权限的账号为Key，使用GoogleAuth授权 {AuthUserName:string[用于授权的账号],AuthCode:string[授权账号的当前GoogleAuth授权码]}|

#### 授权、查权与剥权[暂不实现前端]
使用更高权限的账户为无目标权限的账户进行授权
例如，拥有`Root/北京分部`权限的用户A，可授权任意在此权限下的 `Root/北京分部/*/*/..`权限，而不能授权`Root/武汉分部`。

#####授权
`Post` /account/permission/rest
| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| UserName   | string | 授权目标             |
| Path   | string | 权限路径             |
|AuthCode|json|授权码，经有权限的账号为Key，使用GoogleAuth授权 {AuthUserName:string[用于授权的账号],AuthCode:string[授权账号的当前GoogleAuth授权码]}|
`Response` 权限id

#####查权
`Get` /account/permission/rest
| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| UserName   | string | 目标用户             |
`Response` 
```Json
{
    [
        id:权限的id,
        path:权限路径,
        authBy:授权人
    ]
}
```

#####剥权
`Delete` /account/permission/rest
| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| id   | string | 权限的id             |
|AuthCode|json|授权码，经有权限的账号为Key，使用GoogleAuth授权 {AuthUserName:string[用于授权的账号],AuthCode:string[授权账号的当前GoogleAuth授权码]}|


###用户

---


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
| NotStart | bool | 当值为true时，将不会自动开始审核流程 |

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



#####开始审核流程

---
当`apply/Submit`的`NotStart`选项为`true`时，需要调用此过程手动开始审核流程
`Post` /apply/StartAudit
| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| id   | string | 申请的id  |



####获取申请


`Response`

```json
	{
        applies:[
            {
                id:申请的id,
                from:申请人姓名,
                company:申请来源单位路径,
                create:申请创建的时间,
                status:申请的通过状态,
                //0:未发布 1:已撤回 2:审核中 4:通过所有审核 8:通过，待管理员审核 16:驳回
                remark:如果已驳回或已通过，将存在，表示备注,
                current:当前申请所在层级
            }
            ...
        ]
	}
```



##### 获取指定单位所有申请

---

获取所有已经到达指定单位申请，但不会获取此单位下级单位的申请。

对于用户，应使用它的`PermissionCompanies`去匹配所有可审核单位

`Get`/apply/FromCompany

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| path   | string | 获取申请的单位路径,默认为当前用户所在单位 |
| page   | int | 获取哪一页页面，默认为0 |
| pageSize   | int | 单个页面的项数量，默认为10 |


##### 获取指定用户所有申请

---

获取指定用户提交的所有申请

`Get` /apply/FromUser

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| username   | string | 获取申请的用户名，默认为当前登录的用户  |
| page   | int | 获取哪一页页面，默认为0 |
| pageSize   | int | 单个页面的项数量，默认为10 |










#### 获取单个申请详情

---

`Get`/apply/Detail

| 字段名     | 类型   | 描述               |
| ---------- | ------ | ------------------ |
| id   | string | 申请的id  |

`Response`
```json
	{
        data:{
            id:申请的id,
            from:申请人用户名,
            fromUserName:申请人用户名,
            company:申请来源单位路径,
            create:申请创建的时间,
            status:申请的通过状态,//0:未发布 1:已撤回 2:审核中 4:已通过，待管理员确认 8:通过 16:驳回
            current:当前申请所在层级,        
            progress:[
                {
                    company:审核单位的名称,
                    auditBy:处理人姓名,
                    auditUserName:处理人用户名,
                    hdlstamp:处理时间,
                    status:审核状态,//0:未接收 1:审核中 4:通过 8:驳回
                    remark:备注
                },
                ...
            ],
            detail:{
                fromId:申请人id,
                request:{
                    xjts:休假天数,
                    ltts:路途天数,   
                }
                xjlb:休假类别,
                stamp:{
                    ldsj:离队时间,
                    gdsj:归队时间
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
            remark:备注,
            auditAs:审核人使用的单位路径,//以此确认当前使用何单位的审批权限进行审批
        },
        ...
    ]
}
```

`







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