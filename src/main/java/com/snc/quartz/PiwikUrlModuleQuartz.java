package com.snc.quartz;

import com.snc.service.PiwikUrlModuleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by taotaosun on 2017/9/29.
 */
@Component("piwikUrlModuleQuartz")
public class PiwikUrlModuleQuartz {

    private static final Logger logger = LoggerFactory.getLogger(PiwikUrlModuleQuartz.class);
    @Autowired
    PiwikUrlModuleService piwikUrlModuleService;

    /**
     * 每天凌晨0点执行，清空原表数据，插入新统计数据
     */
    public void refreshPiwikUrlModule(){
        logger.info("------定时刷新piwik_url_module数据表start------");
        piwikUrlModuleService.refreshPiwikUrlModule();
        logger.info("------定时刷新piwik_url_module数据表end------");
    }
}
