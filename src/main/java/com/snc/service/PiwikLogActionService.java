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
}
