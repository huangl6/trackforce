package com.revature.resources;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.hibernate.HibernateException;

import com.revature.model.CurriculumInfo;
import com.revature.services.CurriculumService;

@Path("skillset")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CurriculumResource {

    private CurriculumService service;

    public CurriculumResource() {
        this.service = new CurriculumService();
    }
	
    @GET
	public Response getAllCurriculums() throws HibernateException, IOException{
		Map<BigDecimal, CurriculumInfo> curriculums = service.getCurriculums();
		return Response.ok(curriculums).build();
	}
}
