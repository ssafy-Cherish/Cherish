package com.ssafy.cherish.clip.controller;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.service.ClipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/clip")
@Slf4j
public class ClipController {
    @Autowired
    private ClipService clipService;
    @Value("${custom.path.clip}")
    private String clipPath;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "클립 저장", description = "키워드가 포함된 두 명의 동영상 저장하기위해 파일 두개 입력받음")
    public void saveClip(
            @RequestPart("clip1") MultipartFile clip1,
            @RequestPart("clip2") MultipartFile clip2,
            @Parameter(name = "클립 파일 저장에 필요한 정보 map", description = "meeting_id,couple_id,keyword")
            @RequestParam Map<String, Object> map
    ) {
        log.debug("클립 입력 : {}", map.toString());
        try {
            ClipDto clipDto = new ClipDto();

            clipDto.setMeetingId(Integer.parseInt((String) map.get("meeting_id")));
            clipDto.setKeyword((String) map.get("keyword"));

            clipService.createClip(clipDto);

            log.info("saveClip 중 생성된 filepath 빈 객체 : {}", clipDto.toString());

            // 클립 병합 시 필요한 경로 설정
            // String[] {leftVideoPath,rightVideoPath,resPath,resFile};
            String[] pathForMerge = setClipDir(clipDto);
            log.info(Arrays.toString(pathForMerge));

            //클립 임시 저장
            clip1.transferTo(new File(pathForMerge[0]));
            clip2.transferTo(new File(pathForMerge[1]));

            clipService.saveClip(clipDto,pathForMerge,Integer.parseInt(map.get("couple_id").toString()));

            log.debug("service.saveClip 실행완료");


        } catch (Exception e) {
            e.printStackTrace();
            log.error("동영상 처리 중 문제 발생 : "+e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    String[] setClipDir(ClipDto clipDto) throws Exception {
        // 클립 저장 경로 설정
        String uploadDir = clipPath + clipDto.getMeetingId() + File.separator;
        Path uploadPath = Paths.get(uploadDir);


        // 디렉토리가 없으면 생성
        if (!Files.exists(uploadPath)) {
            //여기서 IOException 발생 가능성 있음
            Files.createDirectories(uploadPath); // 디렉토리 생성
        }

        // 파일명 생성
        String leftVideoPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + "templeft.webm";
        String rightVideoPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + "tempright.webm";
        String resPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + ".webm";
        String resFile=clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + ".webm";

        return new String[]{leftVideoPath, rightVideoPath, resPath,resFile};
    }
}