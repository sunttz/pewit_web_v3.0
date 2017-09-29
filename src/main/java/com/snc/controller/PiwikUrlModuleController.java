package com.snc.controller;

import com.snc.service.PiwikUrlModuleService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by taotaosun on 2017/9/29.
 */
@Controller
@RequestMapping("/pum")
public class PiwikUrlModuleController {
    @Autowired
    PiwikUrlModuleService piwikUrlModuleService;

    /**
     * 查询模块名
     * @param request
     * @return
     */
    @RequestMapping(value = "/selectModuleByUrl")
    @ResponseBody
    public Object selectModuleByUrl(HttpServletRequest request){
        String module = "";
        String url = request.getParameter("url");
        if(StringUtils.isNotBlank(url)){
            List<String> modules = piwikUrlModuleService.selectModuleByUrl(url);
            if(modules.size() > 0){
                module = modules.get(0);
            }
        }
        return module;
    }

    /**
     * 查询url
     * @param request
     * @return
     */
    @RequestMapping(value = "/selectUrlByModule")
    @ResponseBody
    public Object selectUrlByModule(HttpServletRequest request){
        String url = "";
        String module = request.getParameter("module");
        if(StringUtils.isNotBlank(module)){
            List<String> urls = piwikUrlModuleService.selectUrlByModule(module);
            if(urls.size() > 0){
                url = urls.get(0);
            }
        }
        return url;
    }
}
