package com.stt.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Administrator on 2019/8/18.
 */
@RestController
@RequestMapping("/data")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SimpleController {

	@GetMapping("/get")
	public String getData(){
		return "sss";
	}

}
