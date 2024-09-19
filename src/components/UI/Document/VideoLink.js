const VideoLink = ({ src, video_link_class, video_text, target }) => {
    return (
        <a
            href={src}
            className={`${video_link_class} video_link`}
            target={target}
        >
            <span className="video_icon_wrap"><span className="video_icon"></span></span>
            <span className="video_text">{video_text}</span>
        </a>
    );
};
export default VideoLink;
