package com.ssafy.cherish.clip.controller;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.dto.ClipVo;
import com.ssafy.cherish.clip.model.service.ClipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
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
    public ResponseEntity saveClip(
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
            return new ResponseEntity(HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            log.error("동영상 처리 중 문제 발생 : "+e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
            return new ResponseEntity(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCilpCnt")
    @Operation(summary = "총 클립 개수 보여주기", description = "coupleId를 입력하면 해당 커플이 가지고 있는 클립의 총 개수를 반환")
    public ResponseEntity<?> clipCnt (@RequestParam("coupleId") int coupleId) {
        log.debug("clipCnt 호출 : {}", coupleId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            int cnt = clipService.clipCnt(coupleId);
            resultMap.put("clipCnt", cnt);
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("clipCnt 에러 : {}", e.getMessage());
            resultMap.put("clipCnt 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
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

    @PutMapping("/pin/{clipId}/{mode}")
    @Operation(summary = "클립 핀 값 변경", description = "해당 클립에 대한 is_pinned 값 변경")
    public ResponseEntity<?> changePin(@PathVariable int clipId, @PathVariable boolean mode) {
        HttpStatus status = HttpStatus.OK;
        HashMap <String, Object> resultMap = new HashMap<>();

        try {
            int ret = clipService.changePin(clipId, mode);
            resultMap.put("result", mode);
        } catch (Exception e) {
            log.error("changePin 에러 : {}", e.getMessage());
            resultMap.put("msg", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    @GetMapping("/pin/{coupleId}")
    @Operation(summary = "핀된 클립 가져오기", description = "is_pinned가 true인 클립 최신순 6개 반환")
    public ResponseEntity<?> getPinnedClip(@PathVariable int coupleId) {
        HttpStatus status = HttpStatus.OK;
        HashMap <String, Object> resultMap = new HashMap<>();

        try {
            List<ClipVo> list = clipService.getPinnedClip(coupleId);
            resultMap.put("pinnedclip", list);
        } catch (Exception e) {
            log.error("changePin 에러 : {}", e.getMessage());
            resultMap.put("msg", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(resultMap, status);
    }




}