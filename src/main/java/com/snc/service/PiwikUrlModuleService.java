package com.snc.service;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by taotaosun on 2017/9/29.
 */
public interface PiwikUrlModuleService {

    /**
     * 定时任务刷新piwik_url_module表数据
     */
    void refreshPiwikUrlModule();

    /**
     * 查询模块名
     * @param url
     * @return
     */
    List<String> selectModuleByUrl(@Param("url") String url);

    /**
     * 查询url
     * @param module 模块名
     * @return
     */
    List<String> selectUrlByModule(@Param("module") String module);
}
