package com.snc.quartz;

import com.snc.service.PiwikLogActionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by taotaosun on 2017/10/9.
 */
@Component("piwikLogActionQuartz")
public class PiwikLogActionQuartz {
    private static final Logger logger = LoggerFactory.getLogger(PiwikLogActionQuartz.class);

    @Autowired
    PiwikLogActionService piwikLogActionService;

    /**
     * 每月1号零点执行，查询piwik_log_action表idaction最大值，存储到piwik_variable表pla_idaction值下
     */
    public void updatePlaIdaction(){
        logger.info("-----定时更新piwik_variable数据表start------");
        int result = piwikLogActionService.updatePlaIdaction();
        logger.info("-----定时更新piwik_variable数据表result【"+result+"】end------");
    }
}
