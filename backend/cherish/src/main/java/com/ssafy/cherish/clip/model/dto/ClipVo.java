package com.ssafy.cherish.clip.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class ClipVo {
    private final int id;
    private final String keyword;
    private final int coupleId;
    private final String filepath;
}
