const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: 'dfm1c1iri',
    api_key: '467953581335727',
    api_secret: 'RYdlbmtQ70ibH6SW1ewN1jFAoJM'
});

module.exports = async (file, type) => {
    const config = {}
    if (type === "text/plain") {
        config.pages = true
    }
    const response = await cloudinary.uploader.upload(file, config)
    return response
};