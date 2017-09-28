package com.snc.controller;

import com.snc.entity.PiwikLogAction;
import com.snc.service.PiwikLogActionService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/pla")
public class PiwikLogActionController {
    @Autowired
    PiwikLogActionService piwikLogActionService;

    /**
     * 查询模块
     * @param request
     * @return
     */
    @RequestMapping(value = "/getSiteModules")
    @ResponseBody
    public Object getSiteModules(HttpServletRequest request){
        List<Map<String, Object>> maps = null;
        String idsite = request.getParameter("idsite");
        if(StringUtils.isNotBlank(idsite)){
            maps = piwikLogActionService.selectSiteModules(new Integer(idsite));
        }
        return maps;
    }

    /**
     * 更新模块
     * @param request
     * @return
     */
    @RequestMapping(value = "/updateSiteModules")
    @ResponseBody
    public Object updateSiteModules(HttpServletRequest request) {
        int result = 0;
        String idaction = request.getParameter("idaction");
        String name = request.getParameter("name");
        if(StringUtils.isNotBlank(idaction) && StringUtils.isNotBlank(name)){
            try {
                PiwikLogAction pla = new PiwikLogAction();
                pla.setName(name);
                pla.setIdaction(new Integer(idaction));
                result = piwikLogActionService.updateByPrimaryKeySelective(pla);
            } catch (NumberFormatException e) {
                e.printStackTrace();
                result = -1;
            }
        }
        return result;
    }

    /**
     * 查询模块列表
     * @param request
     * @return
     */
    @RequestMapping(value = "/getModulesByType")
    @ResponseBody
    public Object getModulesByType(HttpServletRequest request){
        List<Map<String, Object>> maps = null;
        String type = request.getParameter("type");
        if(StringUtils.isNotBlank(type)){
            maps = piwikLogActionService.selectNamesByType(new Integer(type));
        }
        return maps;
    }
}
