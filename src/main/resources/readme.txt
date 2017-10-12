涉及修改配置文件：
1.数据库地址   piwik_web/src/main/resources/jdbc.properties
2.piwik的HttpAPI地址及秘钥    piwik_web/src/main/webapp/common/js/constant.js

piwik新增表：

-- 模块与url对应关系表
CREATE TABLE piwik_url_module
(
    idsite INT(10) UNSIGNED NOT NULL,
    url_id INT(10) UNSIGNED NOT NULL,
    url_name TEXT,
    module_id INT(10) UNSIGNED,
    module_name TEXT
);
alter table piwik_url_module convert to charset utf8;

-- piwik_web配置变量表
create table piwik_variable
(
	name varchar(32) not null,
	value varchar(32) not null
);
-- 定时任务查询piwik_log_action表中idaction最大值，存储于此
INSERT INTO piwik_variable VALUES ('pla_idaction','0');
