export const AnnotatorModule={
    dispatch:(a)=>{} ,
    controlInjLookupsPerControlId:{
        d:{},
    },
}


export function GetInjectedImageState(state,imgUrl)
{
    const cId=state && state.controlId;
    if(cId)
    {
        const ctl = AnnotatorModule.controlInjLookupsPerControlId.d[cId]
        if(ctl && ctl.getimgdata)
        {
            return ctl.getimgdata(imgUrl,state)
        }
    }
    return undefined
}

export function SetLatestMAtForControl(state,mat){
    const cId=state && state.controlId;
    if(cId)
    {
        const ctl = AnnotatorModule.controlInjLookupsPerControlId.d[cId]
        if(ctl)
        {
            return ctl.annotatorLayoutMatrix = mat
        }
    }
}
