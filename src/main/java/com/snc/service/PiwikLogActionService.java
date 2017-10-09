package com.snc.service;

import com.snc.entity.PiwikLogAction;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by taotaosun on 2017/9/21.
 */
public interface PiwikLogActionService {
    PiwikLogAction selectByPrimaryKey(Integer idaction);

    int updateByPrimaryKeySelective(PiwikLogAction record);

    /**
     * 查询对应网站的模块信息
     * @param idsite 网站id
     * @return
     */
    List<Map<String, Object>> selectSiteModules(@Param("idsite") Integer idsite);

    /**
     * 查询name值
     * @param type 1为url，4为模块
     * @return
     */
    List<Map<String, Object>> selectNamesByType(@Param("type") Integer type);

    /**
     * 查询piwik_log_action的idaction字段最大值，更新到piwik_variable的pla_idaction中
     * @return
     */
    int updatePlaIdaction();

    /**
     * 查询新增模块名
     * @return
     */
    List<String> selectNamesThisMonth();

}
